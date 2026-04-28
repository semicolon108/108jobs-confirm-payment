<template>
  <section class="card upload-card">
    <div class="card-content">
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
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
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

      <button class="btn btn-confirm" :class="{ 'btn--loading': isSubmitting }"
        :disabled="uploadedFiles.length === 0 || isSubmitting" @click="handleConfirm">
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
import { ref } from 'vue'

const emit = defineEmits<{
  confirm: [files: File[]]
}>()

// --- State ---
const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const isSubmitting = ref(false)
const uploadedFiles = ref<File[]>([])

// --- Formatting ---
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// --- File handling ---
function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

function onDragEnter() {
  isDragOver.value = true
}

function onDragOver() {
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

function addFiles(files: File[]) {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg']
  const maxSize = 10 * 1024 * 1024 // 10MB

  for (const file of files) {
    if (!allowed.includes(file.type)) continue
    if (file.size > maxSize) continue
    uploadedFiles.value.push(file)
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

// --- Actions ---
async function handleConfirm() {
  if (uploadedFiles.value.length === 0) return
  isSubmitting.value = true
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))
  isSubmitting.value = false
  emit('confirm', [...uploadedFiles.value])
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
