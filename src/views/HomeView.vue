<template>
  <div class="page-wrapper">
    <LogoLoading v-if="isloading" />
    <div class="page-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-icon">
          <img src="../../public/108.Jobs-Logo.svg" alt="">
        </div>
        <h1 class="page-title">Confirm Payment</h1>
        <p class="page-subtitle">{{ invoice?.companyName || 'Company Name' }}</p>
      </header>

      <!-- Step 1: Upload Receipt -->
      <UploadReceipt v-if="!['paid', 'pending'].includes(invoice?.paymentStatus)" @confirm="onPaymentConfirmed"
        @upload-error="onUploadError" />

      <!-- Step 2: Waiting for Admin Verification -->
      <PaymentPending v-else-if="invoice?.paymentStatus === 'pending'" :files="confirmedFiles" />

      <!-- Step 3: Upload Complete / Approved -->
      <UploadComplete v-else-if="invoice?.paymentStatus === 'paid'" :files="confirmedFiles" :data="invoice"
        @loading="handleReceiptLoading" />

      <!-- Invoice Summary Card -->
      <section class="card invoice-card" v-if="invoice">
        <div class="card-content">
          <!-- Total & Due Date -->
          <div class="invoice-header">
            <div class="invoice-total">
              <span class="invoice-total-label">TOTAL DUE</span>
              <span class="invoice-total-amount" v-if="invoice?.grandTotal">LAK {{ formatAmount(invoice?.grandTotal)
              }}</span>
            </div>
            <div class="invoice-due-date">
              <span class="invoice-due-label">DUE DATE</span>
              <span class="invoice-due-value" :class="{ 'overdue': isOverdue }">
                {{ formatDate(invoice?.overDue) }}
              </span>
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">Invoice Number</span>
              <span class="detail-value">{{ invoice?.invoice_no }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue Date</span>
              <span class="detail-value">{{ formatDate(invoice?.invoiceDate) }}</span>
            </div>
          </div>

          <!-- Breakdown -->
          <div class="invoice-breakdown">
            <div class="detail-row">
              <span class="detail-label">Subtotal</span>
              <span class="detail-value" v-if="invoice?.subTotal">LAK {{ formatAmount(invoice.subTotal) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label" v-if="invoice?.vat">VAT ({{ invoice.vat }}%)</span>
              <span class="detail-value" v-if="invoice?.vatTotal">LAK {{ formatAmount(invoice.vatTotal) }}</span>
            </div>
          </div>

          <!-- Download Button -->
          <button class="btn btn-download" @click="downloadInvoice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Download Invoice
          </button>
        </div>
      </section>

      <!-- Footer Disclaimer -->
      <footer class="page-footer">
        <p>
          By confirming, you verify that the uploaded document is accurate and belongs to you.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import UploadReceipt from '@/components/UploadReceipt.vue'
import PaymentPending from '@/components/PaymentPending.vue'
import UploadComplete from '@/components/UploadComplete.vue'
import axios from '@/services/axios'
import LogoLoading from '@/components/LogoLoading.vue'

const confirmedFiles = ref<any[]>([])

const invoice = ref<any>({})

const isOverdue = computed(() => {
  return new Date(invoice.value?.dueDate) < new Date()
})

// --- Formatting ---
function formatAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return dayjs(dateStr).format('MMMM D, YYYY')
}

const isloading = ref<any>(false)
const statusCheckInterval = ref<any>(null)
const previousPaymentStatus = ref<string>('')

// --- Actions ---

function onUploadError(error: any) {
  alert('Failed to upload receipt. Please try again.')
}

function handleReceiptLoading(isLoading: boolean) {
  isloading.value = isLoading
}

const startStatusCheck = () => {
  // Clear any existing interval
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
  }

  // Only start interval if status is pending
  if (invoice.value?.paymentStatus === 'pending') {
    // Store initial status
    previousPaymentStatus.value = invoice.value?.paymentStatus || ''

    // Check status every 5 seconds
    statusCheckInterval.value = setInterval(async () => {
      const paymentCode: any = localStorage.getItem('paymentCode')
      if (paymentCode) {
        await getInvoiceUrl(paymentCode)
        
        // Stop interval if status is no longer pending
        if (invoice.value?.paymentStatus !== 'pending') {
          stopStatusCheck()
          return
        }
        
        // Update previous status
        previousPaymentStatus.value = invoice.value?.paymentStatus || ''
      }
    }, 15000) // Check every 5 seconds
  } else {
    console.log('Payment status is not pending, not starting status check')
  }
}

const stopStatusCheck = () => {
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
    statusCheckInterval.value = null
  } else {
    console.log('No active interval to stop')
  }
}

const onPaymentConfirmed = async (data: { files: any[], selectedBank: any }) => {
  try {
    isloading.value = true
    const form = {
      _id: invoice.value._id,
      file: data.files,
      bankId: data.selectedBank._id
    }
    const response = await axios.post('/submit-invoice-payslip', form)

    // console.log('Payment confirmed with:', response.data.message)
    if (response.data) {
      const paymentCode: any = localStorage.getItem('paymentCode')
      await getInvoiceUrl(paymentCode)
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
  } finally {
    isloading.value = false
  }
}

const downloadInvoice = async () => {
  try {
    isloading.value = true
    const { _id } = invoice.value
    if (!_id) {
      console.error('No invoice ID found')
      return
    }
    const response = await axios.get(`/generate-invoice-or-receipt/${_id}?type=invoice`)
    // Handle direct URL response from backend
    if (response.data) {
      const link = document.createElement('a')
      link.href = response.data
      link.target = '_blank'
      link.download = `invoice-${_id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isloading.value = false
  }
}

const getInvoiceUrl = async (paymentCode: string) => {
  try {
    const body = {
      paymentCode: paymentCode
    }
    const response = await axios.post('/get-invoice-by-payment-code', body)
    invoice.value = response.data?.invoice
    confirmedFiles.value = response.data?.invoice?.payslip || []
    
    // Start status check if payment status is pending
    if (invoice.value?.paymentStatus === 'pending') {
      startStatusCheck()
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

onMounted(() => {
  const paymentCode: any = localStorage.getItem('paymentCode')
  if (paymentCode) {
    getInvoiceUrl(paymentCode)
  }
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  stopStatusCheck()
})



</script>

<style scoped>
/* ========== Page Layout ========== */
.page-wrapper {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 40px 16px 60px;
}

.page-container {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* ========== Header ========== */
.page-header {
  text-align: center;
}

.header-icon img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.header-icon:hover {
  transform: scale(1.05);
}

.page-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 1.1em;
  color: #64748b;
  font-weight: 400;
}

/* ========== Cards ========== */
.card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.06);
}

.card-content {
  padding: 28px;
}

/* ========== Buttons ========== */
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.btn-download {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
}

.btn-download:hover {
  background: #dbeafe;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.btn-download:active {
  transform: translateY(0);
}

/* ========== Invoice Card ========== */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.invoice-total-label,
.invoice-due-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.invoice-total-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.invoice-due-date {
  text-align: right;
}

.invoice-due-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f97316;
}

.invoice-due-value.overdue {
  color: #ef4444;
}

/* Details rows */
.invoice-details,
.invoice-breakdown {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.detail-label {
  font-size: 0.85rem;
  color: #64748b;
}

.detail-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1e293b;
}

/* ========== Footer ========== */
.page-footer {
  text-align: center;
  padding: 8px 20px 0;
}

.page-footer p {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* ========== Responsive ========== */
@media (max-width: 480px) {
  .page-wrapper {
    padding: 24px 12px 40px;
  }

  .card-content {
    padding: 20px;
  }

  .invoice-total-amount {
    font-size: 1.5rem;
  }

  .page-title {
    font-size: 1.4rem;
  }
}
</style>