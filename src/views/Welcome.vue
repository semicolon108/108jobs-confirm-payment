<template>
    <div class="hello-wrapper">
        <div class="hello-container">
            <!-- Header with Logo -->
            <header class="hello-header">
                <div class="logo-container">
                    <img src="../../public/108.Jobs-Logo.svg" alt="108.Jobs Logo" class="logo" />
                </div>
                <h1 class="hello-title">Welcome to Confirmation Payment</h1>
            </header>
            <!-- Main Content -->
            <main class="hello-content">
                <section class="welcome-card">
                    <div class="card-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7V12C3 16.97 6.84 21.56 12 22.97C17.16 21.56 21 16.97 21 12V7L12 2Z"
                                fill="#3B82F6" opacity="0.15" />
                            <path
                                d="M12 2L3 7V12C3 16.97 6.84 21.56 12 22.97C17.16 21.56 21 16.97 21 12V7L12 2ZM19 12C19 16.15 16.12 19.92 12 21.08C7.88 19.92 5 16.15 5 12V8.3L12 4.19L19 8.3V12Z"
                                fill="#3B82F6" />
                            <path d="M10.5 13.5L8.5 11.5L7.5 12.5L10.5 15.5L16.5 9.5L15.5 8.5L10.5 13.5Z"
                                fill="#3B82F6" />
                        </svg>
                    </div>

                    <h2 class="card-title">Please go to your mailbox or WhatsApp and click the confirmation link again</h2>
                    <p class="card-description">
                        To access your invoice and receipt details, please check your spam folder if you don't see the
                        email.
                    </p>
                </section>

                <!-- Info Section -->
                <section class="info-section">
                    <div class="info-item">
                        <div class="info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V12C2 16.97 5.84 21.56 11 22.97C16.16 21.56 20 16.97 20 12V7L12 2Z"
                                    fill="#10B981" opacity="0.2" />
                                <path
                                    d="M12 2L2 7V12C2 16.97 5.84 21.56 11 22.97C16.16 21.56 20 16.97 20 12V7L12 2ZM18 12C18 16.15 15.12 19.92 11 21.08C6.88 19.92 4 16.15 4 12V8.3L11 4.19L18 8.3V12Z"
                                    fill="#10B981" />
                                <path d="M10 17L6 13L7.41 11.59L10 14.17L15.59 8.59L17 10L10 17Z" fill="#10B981" />
                            </svg>
                        </div>
                        <div class="info-text">
                            <h3>Secure Payment</h3>
                            <p>Your payment information is encrypted and secure</p>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                                    fill="#F59E0B" opacity="0.2" />
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                                    fill="#F59E0B" />
                            </svg>
                        </div>
                        <div class="info-text">
                            <h3>Quick Process</h3>
                            <p>Complete your payment confirmation in just a few steps</p>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="hello-footer">
                <p> Copyright © 108-1009 Group Co., Ltd. | 1st Floor, 108Hill Building Dongpaina Road, Saphanthong
                    Village, Sisattanak District, Vientiane Capital, Lao PDR.</p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handlePaymentClick() {
    // Navigate to home page (will be redirected to hello if no companyId)
    router.push({ name: 'home' })
}
</script>

<style scoped>
/* ========== Layout ========== */
.hello-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 16px;
}

.hello-container {
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
}

/* ========== Header ========== */
.hello-header {
    text-align: center;
    color: white;
}

.logo-container {
    margin-bottom: 24px;
}

.logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);
}

.hello-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hello-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    font-weight: 400;
}

/* ========== Main Content ========== */
.hello-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* ========== Welcome Card ========== */
.welcome-card {
    background: white;
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.card-icon {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
}

.card-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--vt-c-indigo);
    margin-bottom: 16px;
}

.card-description {
    font-size: 1rem;
    color: var(--vt-c-text-light-2);
    line-height: 1.6;
    margin-bottom: 32px;
}

/* ========== Payment Button ========== */
.payment-btn {
    width: 100%;
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    color: white;
    border: none;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.payment-btn:active {
    transform: translateY(0);
}

/* ========== Info Section ========== */
.info-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: white;
}

.info-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

.info-text h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.info-text p {
    font-size: 0.8rem;
    opacity: 0.8;
}

/* ========== Footer ========== */
.hello-footer {
    text-align: center;
    color: white;
    opacity: 0.8;
}

.hello-footer p {
    font-size: 0.8rem;
    margin-bottom: 4px;
}

/* ========== Responsive ========== */
@media (max-width: 480px) {
    .hello-wrapper {
        padding: 24px 12px;
    }

    .hello-container {
        gap: 24px;
    }

    .welcome-card {
        padding: 32px 24px;
    }

    .hello-title {
        font-size: 1rem;
    }

    .card-title {
        font-size: 1.5rem;
    }

    .info-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }
}
</style>