<template>
  <section class="card success-card">
    <div class="card-content">
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon-wrapper">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="#ffffff" stroke-width="2" />
            </svg>
          </div>
          <div class="success-ripple"></div>
        </div>
        <h2 class="success-title">Payment Confirmed</h2>
        <p class="success-subtitle">Your receipt has been uploaded successfully</p>
      </div>

      <!-- Uploaded Files List -->
      <div class="receipt-files">
        <span class="receipt-files-label">Uploaded Files</span>
        <div class="receipt-file-list">
          <div v-for="(file, index) in files" :key="index" class="receipt-file-item">
            <div class="receipt-file-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#fff"
                  stroke="#22c55e" stroke-width="1.5" />
                <path d="M14 2V8H20" stroke="#22c55e" stroke-width="1.5" />
              </svg>
            </div>
            <div class="receipt-file-details">
              <span class="receipt-file-name">{{ file.split('/').pop() || file }}</span>
            </div>
            <button class="receipt-file-download" @click="downloadFile(file)" title="Download file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="#22c55e"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Details -->
      <div class="confirmation-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number</span>
          <span class="detail-value">{{ data.invoice_no }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted At</span>
          <span class="detail-value">{{ formatDate(data?.paymentDate) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value status-badge">
            <span class="status-dot"></span>
            Verified
          </span>
        </div>
      </div>

      <!-- Download Receipt Button -->
      <button class="btn btn-download-receipt" @click="downloadReceipt">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Download Receipt
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import axios from '@/services/axios'
import { storageURL } from '@/global-variable'
const emit = defineEmits<{
  loading: [isLoading: boolean]
}>()

const props = withDefaults(defineProps<{
  files: any[]
  data?: any
  confirmationId?: string
  submittedAt?: Date
}>(), {
  confirmationId: '',
  submittedAt: () => new Date(),
})

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return dayjs(dateStr).format('MMMM D, YYYY')
}


function downloadFile(fileInfo: any) {

  if (!fileInfo) return
  const name = fileInfo.split('/').pop()
  const link = document.createElement('a')
  link.href = storageURL + fileInfo
  link.target = '_blank'
  link.download = `invoice-${name}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


const isloading = ref(false)


const downloadReceipt = async () => {
  try {
    if (!props.data) return
    isloading.value = true
    emit('loading', true)
    const { _id } = props.data
    if (!_id) {
      console.error('No invoice ID found')
      return
    }
    const response = await axios.get(`/generate-invoice-or-receipt/${_id}?type=receipt`)
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
    console.error('Error downloading receipt:', error)
  } finally {
    isloading.value = false
    emit('loading', false)
  }
}


</script>

<style scoped>
/* ========== Card ========== */
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

/* ========== Success Header ========== */
.success-header {
  text-align: center;
  margin-bottom: 28px;
}

.success-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.success-ripple {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  animation: ripple 2s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }

  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.success-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.success-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 400;
}

/* ========== Receipt Files ========== */
.receipt-files {
  margin-bottom: 24px;
}

.receipt-files-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}

.receipt-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.receipt-file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  animation: slideIn 0.4s ease-out both;
}

.receipt-file-item:nth-child(2) {
  animation-delay: 0.1s;
}

.receipt-file-item:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.receipt-file-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  border-radius: 6px;
}

.receipt-file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.receipt-file-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.receipt-file-size {
  font-size: 0.72rem;
  color: #94a3b8;
}

.receipt-file-download {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.receipt-file-download:hover {
  background: #dcfce7;
}

/* ========== Confirmation Details ========== */
.confirmation-details {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding-top: 20px;
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

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #16a34a;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(0.85);
  }
}

/* ========== Download Button ========== */
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

.btn-download-receipt {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.btn-download-receipt:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
}

.btn-download-receipt:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

@media (max-width: 480px) {
  .card-content {
    padding: 20px;
  }
}
</style>
