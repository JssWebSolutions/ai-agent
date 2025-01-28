# AI Agent Manager

A powerful platform for creating, managing, and deploying AI agents with natural language processing capabilities and real-time chat functionality.

![AI Agent Manager](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop)

## Features

- 🤖 **AI Agent Creation**: Create and customize intelligent AI agents with different personalities and capabilities
- 💬 **Real-time Chat**: Engage in natural conversations with AI agents using text or voice input
- 🎨 **Widget Customization**: Fully customizable chat widget for embedding on any website
- 🔒 **Secure Authentication**: Email and password-based authentication with Firebase
- 💳 **Multiple Payment Gateways**: Support for Stripe, PayPal, and Razorpay
- 📊 **Analytics Dashboard**: Track agent performance and user interactions
- 🎯 **Training Interface**: Train agents with custom examples and behaviors
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Payments**: Stripe, PayPal, Razorpay
- **Deployment**: Netlify
- **AI Integration**: OpenAI GPT, Google Gemini

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- OpenAI API key or Google Gemini API key
- Payment gateway accounts (for payments)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-agent-manager.git
   cd ai-agent-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Stripe Configuration
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

   # PayPal Configuration
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   VITE_PAYPAL_CLIENT_SECRET=your_paypal_client_secret

   # Razorpay Configuration
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # React components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── services/      # API and service functions
├── store/         # Zustand store
├── types/         # TypeScript types
├── utils/         # Utility functions
└── widget/        # Embeddable chat widget
```

## Widget Integration

Add the chat widget to any website by including the following code:

```html
<!-- AI Agent Widget -->
<div id="ai-agent-widget"></div>
<script>
  (function() {
    window.voiceAIConfig = {
      agentId: "your_agent_id",
      theme: "light",
      position: "bottom-right",
      buttonSize: "medium",
      borderRadius: "medium",
      showAgentImage: true,
      apiUrl: "https://your-api-url.com/api"
    };

    var script = document.createElement('script');
    script.src = "https://your-domain.com/widget.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  })();
</script>
```

## Security

- Firebase Security Rules for data protection
- Secure API key handling
- Payment data encryption
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@jsswebsolutions.com or join our Discord community.

## Acknowledgments

- [OpenAI](https://openai.com) for GPT API
- [Google](https://ai.google.dev) for Gemini API
- [Firebase](https://firebase.google.com) for backend services
- [Netlify](https://www.netlify.com) for hosting
- [Unsplash](https://unsplash.com) for images