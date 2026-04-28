<template>
  <div class="page-wrapper">
    <div class="page-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-icon">
          <!-- <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 16.97 6.84 21.56 12 22.97C17.16 21.56 21 16.97 21 12V7L12 2Z" fill="#3B82F6"
              opacity="0.15" />
            <path
              d="M12 2L3 7V12C3 16.97 6.84 21.56 12 22.97C17.16 21.56 21 16.97 21 12V7L12 2ZM19 12C19 16.15 16.12 19.92 12 21.08C7.88 19.92 5 16.15 5 12V8.3L12 4.19L19 8.3V12Z"
              fill="#3B82F6" />
            <path d="M10.5 13.5L8.5 11.5L7.5 12.5L10.5 15.5L16.5 9.5L15.5 8.5L10.5 13.5Z" fill="#3B82F6" />
          </svg> -->
          <img src="../../public/108.Jobs-Logo.svg" alt="">
        </div>
        <h1 class="page-title">Confirm Payment</h1>
        <p class="page-subtitle">Company Name</p>
      </header>

      <!-- Step 1: Upload Receipt -->
      <UploadReceipt v-if="status === 'upload'" @confirm="onPaymentConfirmed" />

      <!-- Step 2: Waiting for Admin Verification -->
      <PaymentPending v-else-if="status === 'pending'" :files="confirmedFiles" />

      <!-- Step 3: Upload Complete / Approved -->
      <UploadComplete v-else-if="status === 'approved'" :files="confirmedFiles" />

      <!-- Invoice Summary Card -->
      <section class="card invoice-card">
        <div class="card-content">
          <!-- Total & Due Date -->
          <div class="invoice-header">
            <div class="invoice-total">
              <span class="invoice-total-label">TOTAL DUE</span>
              <span class="invoice-total-amount">${{ formatAmount(invoice.totalDue) }}</span>
            </div>
            <div class="invoice-due-date">
              <span class="invoice-due-label">DUE DATE</span>
              <span class="invoice-due-value" :class="{ 'overdue': isOverdue }">
                {{ formatDate(invoice.dueDate) }}
              </span>
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">Invoice Number</span>
              <span class="detail-value">{{ invoice.invoiceNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue Date</span>
              <span class="detail-value">{{ formatDate(invoice.issueDate) }}</span>
            </div>
          </div>

          <!-- Breakdown -->
          <div class="invoice-breakdown">
            <div class="detail-row">
              <span class="detail-label">Subtotal</span>
              <span class="detail-value">${{ formatAmount(invoice.subtotal) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">VAT ({{ invoice.vatPercent }}%)</span>
              <span class="detail-value">${{ formatAmount(invoice.vatAmount) }}</span>
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
import { ref, computed } from 'vue'
import UploadReceipt from '@/components/UploadReceipt.vue'
import PaymentPending from '@/components/PaymentPending.vue'
import UploadComplete from '@/components/UploadComplete.vue'

// --- State ---
type Status = 'upload' | 'pending' | 'approved'
const status = ref<Status>('upload')
const confirmedFiles = ref<{ name: string; size: number; file: File }[]>([])

const invoice = ref({
  totalDue: 4950.0,
  dueDate: '2026-05-12',
  invoiceNumber: 'INV-2026-0428',
  issueDate: '2026-04-28',
  subtotal: 4500.0,
  vatPercent: 10,
  vatAmount: 450.0,
})

const isOverdue = computed(() => {
  return new Date(invoice.value.dueDate) < new Date()
})

// --- Formatting ---
function formatAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// --- Actions ---
function onPaymentConfirmed(files: File[]) {
  confirmedFiles.value = files.map((f) => ({ name: f.name, size: f.size, file: f }))
  status.value = 'pending'

  // Simulate admin approval after a delay
  setTimeout(() => {
    status.value = 'approved'
  }, 8000)
}

function downloadInvoice() {
  // Placeholder for download logic
  alert('Downloading invoice...')
}
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