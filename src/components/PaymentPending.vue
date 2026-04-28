<template>
  <section class="card pending-card">
    <div class="card-content">
      <!-- Pending Header -->
      <div class="pending-header">
        <div class="pending-icon-wrapper">
          <div class="pending-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#ffffff" stroke-width="2" />
              <path d="M12 7V12L15 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="pending-ring"></div>
        </div>
        <h2 class="pending-title">Payment Under Review</h2>
        <p class="pending-subtitle">Your receipt has been submitted and is being verified by our team</p>
      </div>

      <!-- Progress Steps -->
      <div class="progress-steps">
        <div class="step step--done">
          <div class="step-indicator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="step-content">
            <span class="step-label">Receipt Uploaded</span>
            <span class="step-time">{{ formattedSubmitTime }}</span>
          </div>
        </div>

        <div class="step-connector">
          <div class="step-connector-fill"></div>
        </div>

        <div class="step step--active">
          <div class="step-indicator">
            <span class="step-spinner"></span>
          </div>
          <div class="step-content">
            <span class="step-label">Admin Verification</span>
            <span class="step-time">In progress...</span>
          </div>
        </div>

        <div class="step-connector step-connector--pending"></div>

        <div class="step step--pending">
          <div class="step-indicator">
            <span class="step-number">3</span>
          </div>
          <div class="step-content">
            <span class="step-label">Payment Confirmed</span>
            <span class="step-time">Waiting</span>
          </div>
        </div>
      </div>

      <!-- Uploaded Files -->
      <div class="pending-files">
        <span class="pending-files-label">Submitted Files</span>
        <div class="pending-file-list">
          <div v-for="(file, index) in files" :key="index" class="pending-file-item">
            <div class="pending-file-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                  fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5" />
                <path d="M14 2V8H20" stroke="#3B82F6" stroke-width="1.5" />
              </svg>
            </div>
            <div class="pending-file-details">
              <span class="pending-file-name">{{ file.name }}</span>
              <span class="pending-file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <div class="pending-file-status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="pending-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="1.5" />
          <path d="M12 8V12M12 16H12.01" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" />
        </svg>
        <p>You will be notified once the verification is complete. Please note that it may take up to <strong>48 hours</strong> to confirm your payment.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FileInfo {
  name: string
  size: number
}

const props = withDefaults(defineProps<{
  files: FileInfo[]
  submittedAt?: Date
}>(), {
  submittedAt: () => new Date(),
})

const formattedSubmitTime = computed(() => {
  return props.submittedAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
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

/* ========== Pending Header ========== */
.pending-header {
  text-align: center;
  margin-bottom: 28px;
}

.pending-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.pending-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.pending-ring {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(245, 158, 11, 0.3);
  animation: pendingPulse 2s ease-in-out infinite;
}

@keyframes pendingPulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.pending-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}

.pending-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 400;
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto;
}

/* ========== Progress Steps ========== */
.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 24px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.step-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step--done .step-indicator {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.25);
}

.step--active .step-indicator {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
}

.step--pending .step-indicator {
  background: #e2e8f0;
}

.step-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.step-number {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
}

.step-content {
  display: flex;
  flex-direction: column;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

.step--pending .step-label {
  color: #94a3b8;
}

.step-time {
  font-size: 0.72rem;
  color: #94a3b8;
}

.step--active .step-time {
  color: #d97706;
  font-weight: 500;
}

.step-connector {
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, #22c55e, #f59e0b);
  margin-left: 13px;
  border-radius: 1px;
}

.step-connector--pending {
  background: #e2e8f0;
}

/* ========== Files ========== */
.pending-files {
  margin-bottom: 20px;
}

.pending-files-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}

.pending-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pending-file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.pending-file-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 6px;
}

.pending-file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.pending-file-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pending-file-size {
  font-size: 0.72rem;
  color: #94a3b8;
}

.pending-file-status {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========== Info Banner ========== */
.pending-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #eff6ff;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

.pending-info svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.pending-info p {
  font-size: 0.8rem;
  color: #3b82f6;
  line-height: 1.5;
  font-weight: 400;
}

@media (max-width: 480px) {
  .card-content {
    padding: 20px;
  }
}
</style>
