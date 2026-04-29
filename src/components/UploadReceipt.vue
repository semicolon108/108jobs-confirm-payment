<template>
  <section class="card upload-card">
    <div class="card-content">
      <!-- Bank Selection -->
      <div class="bank-section">
        <label class="upload-label">
          Select Bank <span class="required">*</span>
        </label>
        <div class="bank-grid">
          <div v-for="bank in bankInfo" :key="bank._id" class="bank-item"
            :class="{ 'bank-item--selected': selectedBank?._id === bank._id }" @click="selectBank(bank)">
            <img :src="bank.bankLogo" :alt="bank.bankName" class="bank-logo">
          </div>
        </div>
      </div>

      <!-- QR Code Display -->
      <div v-if="selectedBank" class="qr-section">
        <label class="upload-label">
          QR Code for Payment
        </label>
        <div class="qr-container">
          <img :src="selectedBank.bankQR" :alt="`${selectedBank.bankName} QR Code`" class="qr-code">
          <div class="qr-info">
            <p class="account-name">{{ selectedBank.bankAccountName }}</p>
            <p class="account-number">{{ selectedBank.bankAccountNumber }}</p>
            <p class="currency">{{ selectedBank.currency }}</p>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
      <label class="upload-label">
        Upload Receipt <span class="required">*</span>
      </label>
      <p class="upload-hint">Select or drag &amp; drop your payment proof</p>

      <div class="dropzone" :class="{ 'dropzone--active': isDragOver, 'dropzone--has-files': uploadedFiles.length > 0 }"
        @dragenter.prevent="onDragEnter" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop" @click="triggerFileInput">
        <input ref="fileInput" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" class="file-input"
          @change="onFileSelect" />

        <template v-if="uploadedFiles.length === 0">
          <div class="dropzone-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="#94A3B8"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <p class="dropzone-text">Tap to select files or drag &amp; drop</p>
          <p class="dropzone-formats">PDF, PNG, JPG (MAX 10MB PER FILE)</p>
        </template>

        <template v-else>
          <div class="uploaded-files">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item" @click.stop>
              <div class="file-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                    fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5" />
                  <path d="M14 2V8H20" stroke="#3B82F6" stroke-width="1.5" />
                </svg>
              </div>
              <div class="file-details">
                <span class="file-name">{{ file.split('/').pop() || file }}</span>
              </div>
              <button class="file-remove" @click.stop="removeFile(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <p class="dropzone-add-more">+ Add more files</p>
        </template>
      </div>

      <!-- Validation Message -->
      <div v-if="!selectedBank" class="validation-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Please select a bank to confirm payment
      </div>

      <button class="btn btn-confirm" :class="{ 'btn--loading': isSubmitting }"
        :disabled="uploadedFiles.length === 0 || !selectedBank || isSubmitting" @click="handleConfirm">
        <template v-if="!isSubmitting">
          Confirm Payment
        </template>
        <template v-else>
          <span class="spinner"></span>
          Processing...
        </template>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from '@/services/axios'

const emit = defineEmits<{
  confirm: [data: { files: any[], selectedBank: any }]
  uploadSuccess: [response: any]
  uploadError: [error: any]
}>()

// --- State ---
const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const isSubmitting = ref(false)
const uploadedFiles = ref<any[]>([]) // API response data instead of File objects
const bankInfo = ref<any[]>([])
const selectedBank = ref<any>(null)
const showBankDropdown = ref(false)

const selectBank = (bank: any) => {
  selectedBank.value = bank
  showBankDropdown.value = false
}

// --- File handling ---
const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const onDragEnter = () => {
  isDragOver.value = true
}

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const uploadFiles = async (files: File[]) => {
  try {
    isSubmitting.value = true

    // Create FormData for file upload
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    // Upload files to API
    const response = await axios.post('/upload-payslip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Update uploadedFiles with data from API response
    if (response.data && response.data.fileKey) {
      uploadedFiles.value.push(response.data.fileKey)
    }

  } catch (error) {
    console.error('Upload failed:', error)
    emit('uploadError', error)
  } finally {
    isSubmitting.value = false
  }
}

const addFiles = (files: File[]) => {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg']
  const maxSize = 10 * 1024 * 1024 // 10MB

  const validFiles: File[] = []
  for (const file of files) {
    if (!allowed.includes(file.type)) continue
    if (file.size > maxSize) continue
    validFiles.push(file)
  }

  // Upload files immediately if valid files exist
  if (validFiles.length > 0) {
    uploadFiles(validFiles)
  }
}

const removeFile = (index: number) => {
  // Remove from local array only - no API call needed
  uploadedFiles.value.splice(index, 1)
}

// --- Actions ---
const handleConfirm = () => {
  if (uploadedFiles.value.length === 0) return
  // Files are already uploaded immediately when selected
  emit('confirm', {
    files: [...uploadedFiles.value],
    selectedBank: selectedBank.value
  })
}

const fetchBankInfo = async () => {
  try {
    const response = await axios.get('/get-bank-account-information-web')
    bankInfo.value = response.data?.info
  } catch (error) {
    console.error('Failed to fetch bank info:', error)
  }
}
onMounted(() => {
  fetchBankInfo()
})
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

/* ========== Bank Selection ========== */
.bank-section {
  margin-bottom: 24px;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 6px;
  margin-top: 12px;
}

.bank-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  aspect-ratio: 2;
}

.bank-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.bank-item--selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.bank-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.bank-item:hover .bank-logo {
  transform: scale(1.05);
}

/* ========== QR Code Section ========== */
.qr-section {
  margin-bottom: 24px;
}

.qr-container {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.qr-code {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
  border: 1px solid #e2e8f0;
}

.qr-info {
  flex: 1;
}

.qr-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.account-name {
  font-weight: 600;
  color: #0f172a;
}

.account-number {
  font-family: 'Courier New', monospace;
  color: #64748b;
  font-weight: 500;
}

.currency {
  color: #f97316;
  font-weight: 600;
}

/* ========== Responsive Design ========== */
@media (max-width: 640px) {
  .qr-container {
    flex-direction: column;
    text-align: center;
  }

  .qr-code {
    width: 100px;
    height: 100px;
  }
}

/* ========== Upload Section ========== */
.upload-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.required {
  color: #ef4444;
}

.upload-hint {
  font-size: 0.82rem;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Dropzone */
.dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 36px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fafbfc;
  margin-bottom: 20px;
}

.dropzone:hover {
  border-color: #93c5fd;
  background: #f0f7ff;
}

.dropzone:hover .dropzone-icon svg path {
  stroke: #3b82f6;
}

.dropzone--active {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: scale(1.01);
}

.dropzone--has-files {
  padding: 16px;
  text-align: left;
}

.file-input {
  display: none;
}

.dropzone-icon {
  margin-bottom: 12px;
  opacity: 0.7;
}

.dropzone-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 4px;
}

.dropzone-formats {
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: uppercase;
}

/* Uploaded Files */
.uploaded-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.file-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 6px;
}

.file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.72rem;
  color: #94a3b8;
}

.file-remove {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.file-remove:hover {
  background: #fee2e2;
}

.file-remove:hover svg path {
  stroke: #ef4444;
}

.dropzone-add-more {
  font-size: 0.8rem;
  color: #3b82f6;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  padding: 4px;
}

/* ========== Button ========== */
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

.btn-confirm {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-confirm:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-confirm:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.btn-confirm:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-confirm:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.btn--loading {
  pointer-events: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Validation Message */
.validation-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  color: #92400E;
  font-size: 0.875rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

.validation-message svg {
  flex-shrink: 0;
  margin-top: 2px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .card-content {
    padding: 20px;
  }
}
</style>
