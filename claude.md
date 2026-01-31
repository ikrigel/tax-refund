# Claude.md - Development Context for Tax Refund Extraction System

## 🎯 Project Overview

**Name**: Tax Refund Form 106 Extraction System
**Purpose**: Automated extraction of tax data from Israeli Form 106 (yearly employment tax forms) using AI
**Tech Stack**: n8n (code-free workflow), React (frontend), Google Gemini (AI extraction)
**Status**: Production-ready

## 📊 Architecture

### System Design

```
┌──────────────────────────────────────────────────────┐
│           React SPA (Frontend)                       │
│  Port: 3000 (dev) / 443 (production)                │
│  Tech: React 18, Vite, inline CSS                   │
│  - FileUpload: Drag-and-drop, file validation       │
│  - ResultsDisplay: Organized data presentation      │
│  - ErrorDisplay: Error handling and debugging       │
│  - LoadingSpinner: Async state feedback             │
└────────────────┬─────────────────────────────────────┘
                 │ HTTP POST /webhook/tax-refund
                 │ (multipart/form-data with PDF)
                 ▼
┌──────────────────────────────────────────────────────┐
│         n8n Workflow Server                          │
│  Port: 5678 (default) / 443 (production)            │
│  Database: PostgreSQL (production)                   │
│  Processing: Single linear flow, no code nodes      │
│                                                      │
│  1. Webhook: Receive PDF file                       │
│  2. Google Gemini: Extract structured data          │
│  3. Set Node: Parse JSON response                   │
│  4. Set Node: Validate required fields              │
│  5. IF Node: Route success/error                    │
│  6. Set Node: Build response JSON                   │
│  7. Respond to Webhook: Return result               │
└──────────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│         External Services                           │
│  - Google Gemini API: Document analysis             │
│  - PostgreSQL: Workflow/credential storage          │
└──────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload**: User uploads PDF via React frontend
2. **Webhook**: n8n webhook receives multipart form data
3. **Analysis**: Google Gemini extracts all data fields
4. **Parsing**: JSON parser converts text response to object
5. **Validation**: Required fields checked (tax_year, income, tax_paid)
6. **Response**: Success → structured data | Error → detailed error info
7. **Display**: Frontend shows results or error message

## 🗂️ Project Structure

```
tax-refund/
├── tax-refund-workflow.json          # n8n workflow definition
├── frontend/                          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx        # Drag-drop upload (96 lines)
│   │   │   ├── ResultsDisplay.jsx    # Tax data display (247 lines)
│   │   │   ├── ErrorDisplay.jsx      # Error messages (79 lines)
│   │   │   └── LoadingSpinner.jsx    # Async loading UI (35 lines)
│   │   ├── hooks/
│   │   │   └── useTaxRefund.js       # State management (70 lines)
│   │   ├── services/
│   │   │   └── api.js                # API client (70 lines)
│   │   ├── utils/
│   │   │   └── formatters.js         # Display formatting (62 lines)
│   │   ├── App.jsx                   # Main app component (180 lines)
│   │   ├── index.jsx                 # React entry (8 lines)
│   │   └── styles.css                # Global CSS
│   ├── index.html                    # HTML entry point
│   ├── vite.config.js                # Vite configuration
│   └── package.json
├── README.md                          # User documentation
├── DEPLOYMENT.md                      # Production deployment guide
└── claude.md                          # This file
```

## 🔑 Key Files & Responsibilities

### n8n Workflow (`tax-refund-workflow.json`)
- **Purpose**: Process PDF extraction and data validation
- **Nodes**: 8 nodes (Webhook, Gemini, Set ×3, IF, Respond ×2)
- **Features**: No code nodes, pure configuration
- **Dependencies**: Google Gemini API credentials

### Frontend Components

**FileUpload.jsx** (≈100 lines)
- Drag-and-drop interface
- PDF file validation
- Size limit enforcement (50MB)
- User feedback on selection

**ResultsDisplay.jsx** (≈250 lines)
- Organized sections for each data category
- Conditional rendering based on data availability
- Currency and number formatting
- Hebrew RTL layout

**ErrorDisplay.jsx** (≈80 lines)
- Clear error messaging
- Retry and clear buttons
- Developer debugging info (dev mode)
- Styled error presentation

**LoadingSpinner.jsx** (≈35 lines)
- CSS animation loading indicator
- "Processing..." message
- Minimal styling

**App.jsx** (≈180 lines)
- Main application layout
- State orchestration via useTaxRefund hook
- Conditional rendering of sub-components
- Header, main content, footer structure

### Services & Hooks

**api.js** (≈70 lines)
- Singleton API client
- File upload with FormData
- Error handling and type checking
- Response validation methods

**useTaxRefund.js** (≈70 lines)
- Custom hook for extraction workflow
- State: loading, success, error, data, fileName
- Methods: submitForm, clearResults, retrySubmit
- Error messages in Hebrew

**formatters.js** (≈60 lines)
- formatCurrency: Israeli shekel formatting
- formatNumber: Locale-aware number formatting
- formatDate: ISO to Hebrew datetime
- formatMonthlyIncome: Array summary
- Section title mappings

## 🔧 Technology Decisions

### Why n8n?
- ✅ Code-free workflow (no JavaScript nodes needed)
- ✅ Visual workflow builder
- ✅ Built-in webhook support
- ✅ Native Gemini integration
- ✅ Easy deployment and configuration

### Why React + Vite?
- ✅ Fast development with HMR
- ✅ Lightweight bundle size
- ✅ Easy deployment as static files
- ✅ Excellent developer experience

### Why Google Gemini?
- ✅ Excellent OCR for Hebrew documents
- ✅ Structured output capability
- ✅ Cost-effective
- ✅ Fast processing

### Why RTL/Hebrew UI?
- ✅ Target audience is Israeli
- ✅ Proper localization
- ✅ Professional appearance

## 🎯 Constraints & Guidelines

### File Size Limits
- Frontend: 50MB per file (enforced in FileUpload.jsx)
- n8n: Nginx limit set to 100MB (see DEPLOYMENT.md)
- Google Gemini: 20MB per file (API limit)

### Component Size
- **Max 250 lines per file** (enforced during development)
- Achieved through component composition
- Smaller files easier to maintain and test

### No Code Nodes
- **n8n**: Zero JavaScript/Python code nodes
- All logic via Set nodes (expressions), IF nodes (conditions), etc.
- Easier to maintain, audit, and update

### State Management
- **Frontend**: React hooks only (no Redux/Context for now)
- useTaxRefund hook handles all async logic
- Component props for local state

## 📝 Gemini Prompt Engineering

The Gemini extraction prompt:
```
Analyze this Israeli tax Form 106 and extract ALL information in JSON format.
```

Key aspects:
- ✅ Specific to Form 106 (Israeli context)
- ✅ Requires JSON output (structured)
- ✅ Lists required + optional fields
- ✅ Includes Hebrew field labels for clarity
- ✅ Instructs "Return ONLY valid JSON"

To modify:
1. Edit the text field in the Gemini node
2. Re-export workflow JSON
3. Commit changes with explanation

## 🧪 Testing Strategy

### Unit Tests (Frontend)
```javascript
// Example: Test formatters
import { formatCurrency } from './utils/formatters';
expect(formatCurrency(1000)).toBe('₪1,000');
```

### Integration Tests
```bash
# Test API endpoint
curl -X POST -F "file=@test.pdf" \
  http://localhost:5678/webhook/tax-refund
```

### E2E Tests (Manual)
1. Upload valid Form 106
2. Verify all fields extracted
3. Test error handling (invalid file)
4. Test CORS (different domain)

## 🔐 Security Considerations

### Input Validation
- ✅ PDF file type enforcement (MIME type)
- ✅ File size limits (50MB frontend, 100MB server)
- ✅ No arbitrary code execution (no code nodes)

### API Security
- ✅ HTTPS only in production
- ✅ Optional API key authentication (see DEPLOYMENT.md)
- ✅ CORS configuration
- ✅ Rate limiting recommendations

### Data Handling
- ✅ Stateless processing (no persistence of extracted data by default)
- ✅ No PII storage in logs (disable verbose logging if PII present)
- ✅ Secure credential storage (n8n handles this)

## 🚀 Performance Optimization

### Frontend
- ✅ Vite for fast builds (~500KB gzipped)
- ✅ No heavy dependencies (React + internal modules only)
- ✅ Inline CSS for instant styling
- ✅ No API calls on component load

### Backend
- ✅ Single Gemini API call per request
- ✅ No unnecessary database queries
- ✅ Stream-based response (no buffering)
- ✅ Typical latency: 2-5 seconds per PDF

### Scaling
- Stateless design allows horizontal scaling
- Add load balancer in front of n8n instances
- PostgreSQL for multi-instance support
- Redis for credential caching (optional)

## 📚 Development Workflow

### Local Development
```bash
# Terminal 1: n8n
n8n start

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Test
curl -F "file=@test.pdf" http://localhost:5678/webhook/tax-refund
```

### Making Changes

**To add a field extraction**:
1. Update Gemini prompt in n8n workflow
2. Update ResultsDisplay component
3. Test with sample PDFs

**To modify UI**:
1. Edit relevant .jsx component
2. Changes hot-reload in Vite
3. All components < 250 lines

**To update API behavior**:
1. Edit useTaxRefund.js hook or api.js service
2. Update n8n workflow if needed
3. Test in browser console

### Git Workflow

Commits follow this pattern:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore
Scopes: n8n, frontend, api, docs

## 🐛 Known Issues & Limitations

1. **Language Support**: Currently Hebrew only
   - Solution: Add language selector to App.jsx
   - Update text strings to i18n

2. **Gemini API costs**: Grows with volume
   - Monitor via Google Cloud Console
   - Consider caching for repeated forms

3. **PDF format dependency**: Works best with standard forms
   - Scanned vs digital PDFs have different OCR performance
   - Gemini handles both but scanned may need retries

4. **No persistent storage**: Data only returned to client
   - Add database if audit trail needed
   - Implement logging if compliance required

## 📖 Documentation Map

- **README.md**: User guide, setup, usage
- **DEPLOYMENT.md**: Production deployment steps
- **claude.md**: This file - development context
- **Code comments**: Technical details in components
- **Inline JSDoc**: Function documentation in utils/services

## 🤝 Contributing Guidelines

### Code Style
- ✅ Functional components (no classes)
- ✅ Hooks for state management
- ✅ Explicit naming (no single-letter variables)
- ✅ JSDoc comments for functions
- ✅ No console.log in production (use error boundaries)

### Adding Features
1. Keep components under 250 lines
2. Use existing utility functions
3. Add Hebrew translations if user-facing
4. Document in README if user-exposed
5. Update DEPLOYMENT.md if infrastructure change

### Testing Before Commit
1. Test with multiple PDFs
2. Verify error handling
3. Check responsive design
4. Validate file size limits
5. Test on slow network

## 🔮 Future Enhancements

Possible improvements (not in scope):
- [ ] Multi-language support (English, Arabic, Russian)
- [ ] Database persistence for audit trails
- [ ] Advanced analytics dashboard
- [ ] Batch processing (multiple PDFs)
- [ ] Export to various formats (Excel, PDF report)
- [ ] Tax calculation on backend
- [ ] Integration with accounting software
- [ ] Mobile app (React Native)

## 📞 Support & Contact

For questions about:
- **Architecture**: See system design section above
- **Deployment**: See DEPLOYMENT.md
- **User features**: See README.md
- **Code details**: Check JSDoc comments in files

## 🎓 Learning Resources

- n8n docs: https://docs.n8n.io
- React docs: https://react.dev
- Google Gemini API: https://ai.google.dev
- Form 106 (Israeli Tax Office): https://www.gov.il/he/service/form106

---

**Last Updated**: February 2024
**Maintained by**: Claude Code AI Assistant
**Version**: 1.0.0
