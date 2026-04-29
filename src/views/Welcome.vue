<template>
    <div class="hello-wrapper">
        <div class="hello-container">
            <!-- Main Card -->
            <main class="welcome-card">
                <!-- Logo -->
                <div class="logo-container">
                    <img src="../../public/108.Jobs-Logo.svg" alt="108.Jobs Logo" class="logo" />
                </div>

                <!-- Envelope Icon -->
                <div class="card-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="5" width="18" height="14" rx="1" stroke="#66a9fa" stroke-width="1" fill="none" />
                        <path d="M3 7L12 13L21 7" stroke="#66a9fa" stroke-width="1" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M3 5L12 11L21 5" stroke="#66a9fa" stroke-width="1" stroke-linecap="round"
                            stroke-linejoin="round" opacity="0.3" />
                    </svg>
                </div>

                <!-- Title -->
                <h2 class="card-title">Please use your secure link</h2>

                <!-- Description -->
                <p class="card-description">
                    To upload your payment receipt, please click the link we sent to your email or WhatsApp. This
                    ensures your payment is securely matched to your invoice. If you can't find it, please check your
                    spam folder.
                </p>

                <!-- Info Items -->
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
                            <p>Encrypted and protected transactions</p>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                                    fill="#F59E0B" />
                            </svg>
                        </div>
                        <div class="info-text">
                            <h3>Quick Process</h3>
                            <p>Complete in a few simple steps</p>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="hello-footer">
                <p>Copyright 108-1009 Group Co., Ltd. | 1st Floor, 108Hill Building Dongpaina Road, Saphanthong Village,
                    Sisattanak District, Vientiane Capital, Lao PDR.</p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
// Welcome page - no functionality needed
</script>

<style scoped>
/* ========== Layout ========== */
.hello-wrapper {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 16px;
}

.hello-container {
    width: 100%;
    max-width: 580px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

/* ========== Welcome Card ========== */
.welcome-card {
    background: white;
    border-radius: 16px;
    padding: 48px 32px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
}

/* ========== Logo ========== */
.logo-container {
    margin-bottom: 32px;
}

.logo {
    width: 120px;
    height: 40px;
    object-fit: contain;
}

/* ========== Card Icon ========== */
.card-icon {
    margin: 0 auto 24px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: #f0f9ff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ========== Card Content ========== */
.card-title {
    font-size: 24px;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16px;
    line-height: 1.3;
}

.card-description {
    font-size: 16px;
    color: #424140;
    line-height: 1.6;
    margin-bottom: 40px;
    text-align: left;
}

/* ========== Info Section ========== */
.info-section {
    display: flex;
    gap: 16px;
    margin-top: 32px;
}

.info-item {
    flex: 1;
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px 16px;
    text-align: left;
    border: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    gap: 12px;
}

.info-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-text h3 {
    font-size: 16px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 6px;
}

.info-text p {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
}

/* ========== Footer ========== */
.hello-footer {
    text-align: center;
    color: #6b7280;
}

.hello-footer p {
    font-size: 12px;
    line-height: 1.5;
}

/* ========== Responsive ========== */
@media (max-width: 480px) {
    .hello-wrapper {
        padding: 24px 16px;
    }

    .hello-container {
        max-width: 100%;
    }

    .welcome-card {
        padding: 32px 24px;
    }

    .card-title {
        font-size: 20px;
    }

    .card-description {
        font-size: 14px;
    }

    .info-section {
        flex-direction: column;
        gap: 12px;
    }

    .info-item {
        padding: 16px 12px;
    }
}
</style>