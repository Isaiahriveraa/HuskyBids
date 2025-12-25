/**
 * Shared Clerk Appearance Configuration
 * Matches the minimal design system (experimental components)
 *
 * Design Principles:
 * - Monospace typography
 * - Zinc color palette (950/900/800/700/600/500/400/300)
 * - Dotted borders
 * - No gradients, no shadows, no rounded corners
 * - Extreme whitespace
 */

export const minimalClerkAppearance = {
  variables: {
    colorPrimary: '#71717a',        // zinc-500 (matches login/signup inline config)
    colorText: '#d4d4d8',           // zinc-300
    colorTextSecondary: '#71717a',  // zinc-500
    colorBackground: '#18181b',      // zinc-900
    colorInputBackground: '#27272a', // zinc-800
    colorInputText: '#d4d4d8',      // zinc-300
    fontFamily: 'ui-monospace, monospace',
    fontSize: '14px',
    borderRadius: '0px',
  },
  elements: {
    rootBox: 'mx-auto',

    // Card styling
    card: 'bg-zinc-900 border border-dotted border-zinc-800 shadow-none',

    // Header
    headerTitle: 'text-zinc-300 text-sm font-mono',
    headerSubtitle: 'text-zinc-600 text-xs font-mono',

    // Form elements
    formFieldInput: 'bg-zinc-800 border border-dotted border-zinc-700 text-zinc-300 font-mono text-sm focus:border-zinc-500 rounded-none placeholder:text-zinc-600',
    formFieldLabel: 'text-zinc-500 text-xs font-mono uppercase tracking-wider',
    formFieldInputShowPasswordButton: 'text-zinc-500 hover:text-zinc-400',
    formFieldHintText: 'text-zinc-600 font-mono text-xs',

    // Buttons
    formButtonPrimary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-dotted border-zinc-700 hover:border-zinc-600 font-mono text-sm shadow-none rounded-none',
    formButtonReset: 'text-zinc-500 hover:text-zinc-400 font-mono text-xs',

    // Footer
    footerActionLink: 'text-zinc-500 hover:text-zinc-400 font-mono text-xs',
    footerActionText: 'text-zinc-600 font-mono text-xs',
    footer: 'bg-zinc-900',

    // Social buttons
    socialButtonsBlockButton: 'border border-dotted border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-sm rounded-none shadow-none',
    socialButtonsBlockButtonText: 'font-mono text-sm',
    socialButtonsBlockButtonArrow: 'text-zinc-500',
    socialButtonsIconButton: 'border border-dotted border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-700',

    // Dividers
    dividerLine: 'bg-zinc-800',
    dividerText: 'text-zinc-600 font-mono text-xs uppercase tracking-wider',
    dividerRow: 'gap-4',

    // Identity preview
    identityPreviewText: 'text-zinc-400 font-mono text-sm',
    identityPreviewEditButton: 'text-zinc-500 hover:text-zinc-400 font-mono text-xs',
    identityPreviewEditButtonIcon: 'text-zinc-500',

    // Verification code
    otpCodeFieldInput: 'bg-zinc-800 border border-dotted border-zinc-700 text-zinc-300 font-mono rounded-none text-center focus:border-zinc-500',

    // Alerts/Errors
    formFieldErrorText: 'text-red-400 font-mono text-xs',
    formResendCodeLink: 'text-zinc-500 hover:text-zinc-400 font-mono text-xs',
    alertClerkError: 'bg-zinc-900 border border-dotted border-red-900 text-red-400 font-mono text-xs rounded-none',
    alert: 'bg-zinc-900 border border-dotted border-zinc-800 text-zinc-300 font-mono text-xs rounded-none',

    // Loading
    spinner: 'border-zinc-700 border-t-zinc-400',

    // Badges
    badge: 'bg-zinc-800 text-zinc-400 font-mono text-xs border border-dotted border-zinc-700',

    // Modal overlay (if applicable)
    modalBackdrop: 'bg-black/80 backdrop-blur-sm',
    modalContent: 'bg-zinc-900 border border-dotted border-zinc-800',

    // Navbar (if using)
    navbar: 'bg-zinc-900 border-b border-dotted border-zinc-800',
    navbarButton: 'text-zinc-500 hover:text-zinc-400 font-mono',

    // Form container
    formContainer: 'gap-6',
    formFieldRow: 'gap-4',

    // Internal card
    cardBox: 'bg-zinc-900',

    // Alternative methods
    alternativeMethods: 'bg-zinc-900',
    alternativeMethodsBlockButton: 'border border-dotted border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-700 font-mono text-sm rounded-none',
  },
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'iconButton',  // Icon buttons (not block) to match original
  }
};
