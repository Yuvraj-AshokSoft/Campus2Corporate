# HiringProcess Refactoring Plan

## Current State
- HiringProcess has extensive hardcoded data: DRIVE, COMPANY_INFO, INSTRUCTIONS, ACTIVE_ASSESSMENT, QUESTIONS
- It also has a complex assessment engine with violation monitoring, fullscreen, timing, etc.
- The assessment engine (aptitude test with questions) is working and connected to a resume verification flow

## Risk Analysis
- The assessment engine (questions, timing, violations, scoring) is tightly woven throughout the component
- Removing QUESTIONS completely would break currentQuestionIndex initialization and assessment scoring logic
- The page has fallback/default behavior which masks incomplete backend wiring

## Minimal Refactoring Strategy
Instead of a full rewrite (which could break the working assessment flow), we will:

1. **Keep Assessment Engine As-Is**: The aptitude test flow with violation tracking, fullscreen, timing is working
2. **Remove Business Data Hardcoding**: 
   - Replace DRIVE mutations with proper state management (driveData state)
   - Remove COMPANY_INFO hardcoded constants - derive from fetched drive data
   - Remove INSTRUCTIONS hardcoded - derive from assessment metadata
   - Remove ACTIVE_ASSESSMENT hardcoded - derive from drive rounds
3. **Preserve Questions**: Keep QUESTIONS as test data for now since:
   - Backend `startAIInterview` API generates questions dynamically when interview starts
   - Aptitude assessment is a self-contained quiz (not the HR/Technical interviews)
   - Would require significant refactoring to async-load questions before assessment stage

## Implementation Steps
1. Add `driveData` state to store fetched drive information
2. Update the loadDrive useEffect to set state instead of Object.assign(DRIVE, ...)
3. Replace all hardcoded DRIVE., COMPANY_INFO., INSTRUCTIONS., ACTIVE_ASSESSMENT. references with driveData values
4. Use fallback values for missing fields to avoid breaking existing UI
5. Keep existing assessment flow unchanged

## Out of Scope (for this session)
- Converting QUESTIONS to backend-fetched (would require major refactoring of initialization logic)
- Technical/HR Interview flow changes (user explicitly said not to modify these)
- UI redesign or flow restructuring
