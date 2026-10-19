-- ---------------------------------------------------------------- categories
INSERT INTO categories (name, slug, description) VALUES
  ('Topic Selection',   'topic-selection',   'Finding a feasible, original and publishable research question.'),
  ('Data Analysis',     'data-analysis',     'Biostatistics, sample size and clean tables for medical researchers.'),
  ('Protocol & IEC',    'protocol-iec',      'Writing protocols that clear ethics committees the first time.'),
  ('Publishing',        'publishing',        'Turning a thesis into an indexed journal article.'),
  ('Resident Life',     'resident-life',     'Time, energy and sanity while writing a thesis on night duties.');

-- ---------------------------------------------------------------- services
INSERT INTO service_offerings (code, number, title, summary, features, badge, highlight, sort_order) VALUES
('TOPIC', '01', 'Topic Brainstorming',
 $$Find a feasible, original and publishable research question that suits your specialty, department resources and university timeline.$$,
 $$3-5 curated topic options with rationale
Feasibility check (patients, data, timeline)
Gap analysis from recent literature
Title framing for ethics committee approval
Delivered within 48-72 hours$$,
 NULL, FALSE, 1),

('PROTOCOL', '02', 'Protocol Mentoring',
 $$Co-develop an IEC-ready protocol, the document most often sent back during residency, using your university's format.$$,
 $$Protocol structured to your university format
Aims, objectives and review of literature
Methodology with inclusion/exclusion criteria
Sample size calculation with justification
Statistical plan and ethical considerations
IEC/IRB application guidance
2 rounds of revision included$$,
 NULL, FALSE, 2),

('LITERATURE', '03', 'Literature Review & Discussion',
 $$A structured, current review of the evidence and a discussion chapter that places your findings in context.$$,
 $$Systematic search across PubMed, Cochrane and more
Thematic synthesis of the literature
Comparative discussion against your results
Limitations, conclusions and recommendations
References formatted in Vancouver or APA
2 rounds of revision included$$,
 NULL, FALSE, 3),

('DATA_ANALYSIS', '04', 'Data Analysis & Biostatistics',
 $$You collect the clinical data. We help you design the tools, choose the right tests and present results that stand up to viva questions.$$,
 $$Data collection sheet and coding plan
Cleaning and validation of your dataset
Test selection with a plain-language rationale
Tables, figures and result interpretation
Walkthrough so you can explain every number$$,
 NULL, FALSE, 4),

('COMPLETE', '05', 'Complete Thesis Pathway',
 $$End-to-end support from topic to submission, with a named mentor who stays with you until the thesis is approved.$$,
 $$Topic selection and title finalisation
IEC-ready protocol
All chapters, introduction to bibliography
Data analysis, tables and figures
University-specific formatting
Plagiarism report (target under 15 percent)
Revisions until your guide signs off$$,
 'Best value', TRUE, 5),

('PUBLICATION', '06', 'Publication & Manuscript Support',
 $$Beyond the thesis: shape case reports, reviews and original articles into submission-ready manuscripts.$$,
 $$Case report, case series, review, systematic review, meta-analysis
Journal-specific formatting (ICMJE, Vancouver)
Structured and unstructured abstracts
CARE and PRISMA checklist compliance
Cover letter and response to reviewers
Target journal selection guidance$$,
 NULL, FALSE, 6);

-- ---------------------------------------------------------------- specialties
INSERT INTO specialties (name, group_name, sort_order) VALUES
('General Medicine', 'Clinical', 1), ('Paediatrics', 'Clinical', 2), ('Psychiatry', 'Clinical', 3),
('Dermatology', 'Clinical', 4), ('Emergency Medicine', 'Clinical', 5), ('Pulmonology', 'Clinical', 6),
('General Surgery', 'Surgical', 7), ('Orthopaedics', 'Surgical', 8), ('Obstetrics & Gynaecology', 'Surgical', 9),
('Ophthalmology', 'Surgical', 10), ('ENT', 'Surgical', 11), ('Anaesthesiology', 'Surgical', 12),
('Radiology', 'Para-clinical', 13), ('Pathology', 'Para-clinical', 14), ('Microbiology', 'Para-clinical', 15),
('Pharmacology', 'Para-clinical', 16), ('Community Medicine', 'Para-clinical', 17),
('Biochemistry', 'Pre-clinical', 18), ('Physiology', 'Pre-clinical', 19), ('Anatomy', 'Pre-clinical', 20),
('Cardiology (DM)', 'Super-specialty', 21), ('Neurology (DM)', 'Super-specialty', 22), ('Nephrology (DM)', 'Super-specialty', 23);

-- ---------------------------------------------------------------- faqs
INSERT INTO faqs (question, answer, sort_order) VALUES
('Is this ethical?',
 $$We provide research mentoring, scientific editing and biostatistics support, the same kind of help offered by statisticians, medical writers and editors. You remain the investigator: you collect the data, you understand every section and you are accountable for the final work. Please check your institution's policy on external support before you begin.$$, 1),
('Do I have to collect the data myself?',
 $$Yes. Clinical data collection is your role as the researcher. We help design your data collection tools, plan the analysis, interpret results and write them up clearly.$$, 2),
('Will the work be good enough for my guide?',
 $$Every service includes revision rounds. If your guide asks for changes, we incorporate them within the agreed scope. We also prepare you with short briefing notes so you can discuss the work confidently.$$, 3),
('What if my IEC rejects the protocol?',
 $$We revise the protocol against the committee's specific objections at no extra charge for one round of IEC-related revisions. Our templates are written around the most common reasons for rejection.$$, 4),
('My submission is in 20 days. Is it too late?',
 $$Not necessarily. A topic and protocol can often be finalised within a week, and a full thesis typically needs three to four weeks depending on data availability. Share your timeline in the enquiry form and we will tell you honestly what is feasible.$$, 5),
('How does payment work?',
 $$A small advance starts the work and the balance is due before the final draft is released. We accept UPI, bank transfer and major payment apps, and we agree on deliverables and a delivery date in writing first.$$, 6),
('Is my information confidential?',
 $$Yes. Your name, institution and research details are never shared or published, and we do not keep a public client list.$$, 7);

-- ---------------------------------------------------------------- resources
INSERT INTO resources (title, description, file_type, url, sort_order) VALUES
('Synopsis outline', 'A section-by-section outline for a medical thesis synopsis you can adapt to your university format.', 'MD', '/downloads/synopsis-outline.md', 1),
('Thesis dissertation outline', 'Chapter checklist from introduction to annexures, with the usual page-count expectations.', 'MD', '/downloads/thesis-outline.md', 2);

-- ---------------------------------------------------------------- posts
INSERT INTO posts (title, slug, excerpt, content, author, read_minutes, published, published_on, category_id) VALUES

('How to Choose a Research Topic You Can Actually Finish',
 'how-to-choose-a-research-topic-you-can-finish',
 'A great topic is not the most ambitious one. It is the one your department can support with patients, time and a guide who has an hour to spare.',
 $$Most residents start with a topic that is too big. A thesis has a fixed window, a fixed patient pool and a guide with limited time, so the best topic is the one that fits all three.

## Start with your patient flow
Look at what your OPD and wards see every week. A question you can answer with patients who already walk through the door is far safer than one that needs a special cohort.

## Run the FINER test
Before you commit, check that the question is:

- **Feasible**: enough patients, time, money and skills
- **Interesting**: to you and to your guide
- **Novel**: it adds something to what is already published
- **Ethical**: your IEC can approve it
- **Relevant**: it could change practice or the next study

## Do a quick gap search
Spend two hours on PubMed with your keywords. If ten recent studies already answer the same question in an Indian population, adjust the population, the outcome or the setting.

## Write the question in one sentence
If you cannot state the question, population, exposure and outcome in a single sentence, the topic is not ready. Rewrite it until a colleague can repeat it back to you.

## Check the timeline backwards
Count back from your submission date and leave time for IEC approval, data collection, analysis and two rounds of guide corrections. If the numbers do not fit, shrink the study.$$,
 'ThesisPulse Editorial Team', 4, TRUE, DATE '2026-09-14', (SELECT id FROM categories WHERE slug = 'topic-selection')),

('Statistics Without Tears: Picking the Right Test',
 'statistics-without-tears-picking-the-right-test',
 'You do not need to be a statistician to analyse your own data. You need to know what kind of data you have and what question you are asking.',
 $$Biostatistics feels intimidating because it is usually taught as formulas. In practice, choosing a test comes down to three questions.

## 1. What type of data is your outcome?
- **Categorical** (yes/no, grade, stage): think chi-square or Fisher's exact test
- **Continuous and roughly normal** (haemoglobin, blood pressure): think t-test or ANOVA
- **Continuous but skewed or small sample**: think Mann-Whitney U or Kruskal-Wallis

## 2. How many groups are you comparing?
Two independent groups, two measurements on the same patients, or three or more groups each lead to a different test family. Write the comparison as a sentence first, then name the test.

## 3. Are the observations paired?
Before-and-after readings on the same patient need paired tests. Treating them as independent is one of the most common errors examiners spot.

## Always report more than a p-value
Give the effect size and a 95 percent confidence interval. A p-value tells you whether an effect is unlikely to be chance. It does not tell you whether it matters clinically.

## Check assumptions, then explain them
Run a normality check and note it in your methods. In your viva, be ready to say in one sentence why you chose each test.$$,
 'ThesisPulse Editorial Team', 3, TRUE, DATE '2026-09-21', (SELECT id FROM categories WHERE slug = 'data-analysis')),

('Sample Size 101: How Many Patients Do You Really Need?',
 'sample-size-101-how-many-patients-do-you-need',
 'Too few patients and your study cannot detect anything. Too many and you waste months. Here is how to justify your number to the ethics committee.',
 $$Every IEC asks the same thing: why this many patients? A defensible answer has four ingredients.

## The ingredients
- **Expected effect or proportion**, taken from a published study similar to yours
- **Confidence level**, usually 95 percent
- **Power**, usually 80 percent
- **Allowance for dropouts or incomplete records**, often 10 percent

## Match the formula to the design
A prevalence study, a comparison of two proportions and a comparison of two means each use a different formula. Quote the formula or software you used, plus the reference that supplied your inputs.

## Cite your source
Never write that a number was assumed. Write that it was taken from a named study with a link to the citation. This one habit prevents many queries.

## Be honest about feasibility
If the calculation gives you 400 patients and your department sees 40 a year, change the design, the outcome or the setting before you submit the protocol, not after.

## Keep the working
Save the inputs and output screenshot. You will be asked about them at the viva.$$,
 'ThesisPulse Editorial Team', 3, TRUE, DATE '2026-09-28', (SELECT id FROM categories WHERE slug = 'data-analysis')),

('Why IEC Committees Send Protocols Back (and How to Avoid It)',
 'why-iec-committees-send-protocols-back',
 'Most rejections are avoidable. They come from missing consent details, unclear inclusion criteria and mismatched documents, not from weak science.',
 $$After reading many committee queries, the same issues come up again and again.

## Common reasons for queries
- Participant information sheet is written in dense medical language
- Consent form does not cover storage of data or right to withdraw
- Inclusion and exclusion criteria do not match the methods section
- Sample size has no stated source
- Title in the application differs from the title in the protocol
- Conflict of interest and funding sections left blank

## Build a consistency checklist
Before you submit, read the title, objectives, outcome measures and statistical plan side by side. They should tell the same story in the same words.

## Write the information sheet for the patient
Use short sentences, and have it translated into the local language by someone who is not a doctor. If a family member cannot follow it, the committee will not be satisfied.

## Plan for the second round
Keep a response table listing each query, your answer and the page where the change was made. Committees appreciate a tidy reply and it speeds up approval.$$,
 'ThesisPulse Editorial Team', 3, TRUE, DATE '2026-10-04', (SELECT id FROM categories WHERE slug = 'protocol-iec')),

('From Thesis to Journal: A Submission Checklist',
 'from-thesis-to-journal-a-submission-checklist',
 'Your thesis already holds a publishable paper. Here is how to reshape it, pick a journal and survive peer review.',
 $$A thesis is written for examiners. A manuscript is written for readers who have ten minutes. The shift in mindset is the biggest part of the work.

## Before you write
1. Decide the one message of the paper
2. Choose two or three target journals, checking indexing and scope
3. Read the author guidelines and note word, table and reference limits

## Reshape the content
- Compress the introduction to the gap and the aim
- Keep the methods reproducible but short
- Show only the results that answer your question
- Use the discussion to compare, explain and admit limitations

## Follow the reporting guidelines
Use CONSORT for trials, STROBE for observational studies, CARE for case reports and PRISMA for systematic reviews. Attach the completed checklist with your submission.

## Prepare the package
Cover letter, title page, ethics approval, consent statement, conflict of interest form and figures at the requested resolution.

## Handling reviewer comments
Answer every comment politely, one by one, and quote the change you made. If you disagree, say so with evidence. Silence is the quickest route to rejection.$$,
 'ThesisPulse Editorial Team', 4, TRUE, DATE '2026-10-09', (SELECT id FROM categories WHERE slug = 'publishing')),

('Writing a Thesis Around Night Duties: A Practical Rhythm',
 'writing-a-thesis-around-night-duties',
 'You will not find a free week. You will find twenty-five minutes, repeatedly. Here is how to make that enough.',
 $$Residency leaves little room for deep work, so the trick is to make small sessions count.

## Break the thesis into 25-minute tasks
Instead of writing the review of literature, write the paragraph on one subtopic. Each finished task is visible progress.

## Use a single thesis folder
Keep PDFs, data sheets, drafts and guide comments in one place with dated file names. Time lost searching for files is the quiet enemy.

## Reference as you go
Use a reference manager from the first article you read. Rebuilding citations at the end is a miserable week.

## Schedule guide meetings with an agenda
Send two or three specific questions the day before. A focused meeting gets a decision, while an open-ended one gets a promise to look at it later.

## Protect your sleep
A rested resident writes cleaner methods and makes fewer data entry mistakes. Treat sleep as part of the thesis plan, not a reward after it.

## Ask for help early
Statistics, language editing and formatting are all legitimate places to get support. Ask while there is still time to learn from it.$$,
 'ThesisPulse Editorial Team', 3, TRUE, DATE '2026-10-14', (SELECT id FROM categories WHERE slug = 'resident-life'));
