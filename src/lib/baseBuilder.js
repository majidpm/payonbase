// ✅ Base Builder Configuration
export const BASE_BUILDER_CODE = 'bc_3mjjig8s'
export const BASE_APP_ID = '6a36b7cfc42b7d63b0563be8'
export const BASE_DOMAIN = 'payonbase24.vercel.app'

// ✅ Helper function برای اضافه کردن builder code به تراکنش‌ها
export function withBuilderCode(txData) {
  return {
    ...txData,
    builder: BASE_BUILDER_CODE
  }
}

// ✅ Initialize builder code در window
if (typeof window !== 'undefined') {
  window.baseBuilder = {
    appId: BASE_APP_ID,
    builderCode: BASE_BUILDER_CODE,
    domain: BASE_DOMAIN
  }
}