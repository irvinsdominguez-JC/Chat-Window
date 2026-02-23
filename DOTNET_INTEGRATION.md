# Integrating with .NET 4.8 MVC

To integrate this Joan S. AI Support Chat into your .NET 4.8 MVC website, follow these steps:

## 1. Build the React Application
Run the following command in the project root:
```bash
npm run build
```
This will generate a `dist` folder containing the compiled assets.

## 2. Copy Assets to your .NET Project
Copy the files from the `dist/assets` folder into your .NET project's `Scripts` and `Content` (or a dedicated `ChatWidget`) directory:
- `index-[hash].js` -> `~/Scripts/chat-widget.js`
- `index-[hash].css` -> `~/Content/chat-widget.css`

## 3. Update your View (.cshtml)
In the view where you want the chat to appear (e.g., `_Layout.cshtml` or `Contact.cshtml`), add the following:

```html
<!-- Container for the React App -->
<div id="root"></div>

<!-- Styles -->
<link rel="stylesheet" href="~/Content/chat-widget.css" />

<!-- Scripts -->
<script src="~/Scripts/chat-widget.js"></script>
```

## 4. Handling API Calls
The application currently calls the Gemini API directly from the frontend. If you prefer to proxy these calls through your .NET backend for security:
1. Create a Controller action in .NET:
   ```csharp
   [HttpPost]
   public async Task<ActionResult> Chat(string message) {
       // Call Gemini API from C#
       // Return JSON response
   }
   ```
2. Update `src/services/geminiService.ts` to call your new endpoint instead of the direct Gemini SDK.

## 5. Environment Variables
Ensure the `GEMINI_API_KEY` is available. In a production .NET environment, you should move the AI logic to the server-side to protect your API key.
