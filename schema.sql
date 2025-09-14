-- ====== CORE TABLES ======
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  lang TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS words(
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example TEXT,
  level TEXT CHECK (level IN ('B2','C1','C2')) DEFAULT 'B2',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exams(
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type IN ('reading','listening')) NOT NULL,
  title TEXT NOT NULL,
  passage TEXT,                -- reading için
  audio_key TEXT,              -- listening için
  questions JSONB NOT NULL,    -- [{q, options[], answerIndex}]
  time_seconds INT DEFAULT 900,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,          -- reading | listening | speaking
  raw_score INT,
  max_score INT,
  scaled_score INT NOT NULL,
  taken_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS speaking_prompts(
  id SERIAL PRIMARY KEY,
  task_type TEXT CHECK (task_type IN ('independent','integrated')) NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  prep_seconds INT DEFAULT 15,
  speak_seconds INT DEFAULT 45,
  audio_key TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS speaking_attempts(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  prompt_id INT REFERENCES speaking_prompts(id) ON DELETE CASCADE,
  audio_key TEXT,
  transcript TEXT,
  wpm INT,
  pause_count INT,
  score_fluency INT,
  score_pronunciation INT,
  score_grammar INT,
  score_vocabulary INT,
  score_task INT,
  scaled_score INT,
  feedback_json JSONB,
  taken_at timestamptz DEFAULT now()
);

-- Favorites tablosu: kullanıcıların favori kelimeleri
CREATE TABLE IF NOT EXISTS favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  word_id INT REFERENCES words(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, word_id)
);

-- ====== VOCAB SEED (40 items, B2–C1 mix) ======
INSERT INTO words(term,meaning,example,level) VALUES
('meticulous','very careful and precise','She keeps meticulous notes for each lecture.','C1'),
('feasible','possible and practical','Is this feature feasible within our sprint?','B2'),
('alleviate','to make something less severe','The new policy could alleviate student stress.','C1'),
('ambiguous','having more than one meaning','The instruction was ambiguous and confusing.','B2'),
('compelling','evoking interest or attention','He gave a compelling argument in the debate.','C1'),
('scarce','in short supply','Dorm rooms are scarce this semester.','B2'),
('deteriorate','to become worse','Air quality tends to deteriorate in winter.','C1'),
('mitigate','to reduce the impact of','We must mitigate the risks before launch.','C1'),
('novice','a beginner','As a novice, she asked many questions.','B2'),
('pragmatic','practical rather than theoretical','We need a pragmatic solution today.','C1'),
('abide','to accept or act in accordance with','Students must abide by the code of conduct.','B2'),
('coherent','logical and consistent','Your essay is coherent and well organized.','C1'),
('prevalent','widespread in a particular area','Online learning is prevalent after 2020.','C1'),
('viable','capable of working successfully','This is a viable business model.','B2'),
('underpin','support, justify, or form the basis of','Research data underpins the conclusion.','C1'),
('advocate (v.)','to publicly support','Professors advocate for more funding.','B2'),
('constraint','limitation or restriction','Budget constraints delayed the project.','B2'),
('discrepancy','a lack of compatibility','There was a discrepancy in the results.','C1'),
('credible','able to be believed','The source is credible and peer-reviewed.','B2'),
('facilitate','to make easier','Slides facilitate understanding.','B2'),
('albeit','although','He passed the exam, albeit narrowly.','C1'),
('inadvertent','unintentional','It was an inadvertent error in the report.','C1'),
('notion','an idea or belief','The notion is widely accepted.','B2'),
('arduous','difficult and tiring','Preparing for TOEFL can be arduous.','C1'),
('assert','state a fact or belief confidently','The author asserts that prices will rise.','B2'),
('constrain','compel or restrict','Time constraints limited our options.','B2'),
('contend','to argue or assert','Researchers contend the opposite is true.','C1'),
('counterpart','a person or thing equivalent','Our counterparts in Europe agreed.','B2'),
('discrete','separate and distinct','We analyzed discrete user segments.','C1'),
('elicit','to draw out a response','The question elicited thoughtful answers.','C1'),
('hinder','to create difficulties for','Slow Wi-Fi can hinder online exams.','B2'),
('imperative','of vital importance','It is imperative to study daily.','C1'),
('inherent','existing as a natural part','There are inherent risks in travel.','C1'),
('plausible','seemingly reasonable','This is a plausible explanation.','B2'),
('preclude','to prevent from happening','Late submissions preclude full credit.','C1'),
('salient','most noticeable or important','Summarize the salient points.','C1'),
('scrutinize','to examine closely','Scrutinize the data before concluding.','C1'),
('subsequent','coming after something in time','Subsequent tests confirmed the result.','B2'),
('tangible','clear and definite; real','We need tangible results this week.','B2'),
('ubiquitous','present everywhere','Smartphones are ubiquitous on campus.','C1');

-- ====== READING EXAM (1x, 5 Q) ======
INSERT INTO exams(type, title, passage, questions, time_seconds)
VALUES
('reading','Campus Services Update',
 'The university has expanded library hours and introduced a peer tutoring program. While the gym remains under renovation, students can access temporary fitness classes in the student center. Surveys indicate that extended library hours most effectively support exam preparation, especially for commuter students.',
 '[
   {"q":"Which service most helps exam preparation?","options":["Gym","Library","Tutoring","Cafeteria"],"answerIndex":1},
   {"q":"Where are fitness classes held during renovation?","options":["Gym","Student center","Dorm","Auditorium"],"answerIndex":1},
   {"q":"What new academic support was introduced?","options":["Scholarships","Peer tutoring","New lab","Book fair"],"answerIndex":1},
   {"q":"Who benefits most from extended hours?","options":["Commuters","Residents","Faculty","Alumni"],"answerIndex":0},
   {"q":"What is currently under renovation?","options":["Library","Gym","Cafeteria","Student center"],"answerIndex":1}
 ]'::jsonb,
 900
);

-- ====== LISTENING EXAM (1x, 5 Q, dummy audio) ======
INSERT INTO exams(type, title, audio_key, questions, time_seconds)
VALUES
('listening','Library Orientation','s3://dummy/audio1.m4a',
 '[
   {"q":"What does the librarian recommend first?","options":["Tour","Printing","Study rooms","Cafe"],"answerIndex":0},
   {"q":"Where are the computers located?","options":["First floor","Basement","Third floor","Annex"],"answerIndex":1},
   {"q":"How long can books be borrowed?","options":["1 day","1 week","2 weeks","1 month"],"answerIndex":2},
   {"q":"How to reserve a study room?","options":["Phone","Walk-in","Online system","Email"],"answerIndex":2},
   {"q":"What is required at checkout?","options":["Cash","Student ID","Passport","Nothing"],"answerIndex":1}
 ]'::jsonb,
 600
);

-- ====== SPEAKING PROMPTS (3x) ======
INSERT INTO speaking_prompts(task_type, title, prompt_text, prep_seconds, speak_seconds, audio_key)
VALUES
('independent',
 'Daily Routines',
 'Describe a daily habit that improves your productivity. Explain why it is effective, using specific examples.',
 15, 45, NULL),
('integrated',
 'Campus Announcement',
 'Reading: The university will introduce evening shuttle buses to support late-night study. Listening: A student agrees, noting safety and convenience, but worries about noise near dorms.',
 30, 60, 's3://dummy/listening1.m4a'),
('integrated',
 'Library Change',
 'Reading: The library will pilot a silent floor policy. Listening: A student supports the change for concentration, yet fears it could make group work harder.',
 30, 60, 's3://dummy/listening2.m4a');

CREATE TABLE IF NOT EXISTS test_table (
  id SERIAL PRIMARY KEY,
  name TEXT
);

-- Progress tablosu
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  quizzes_taken INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_activity DATE DEFAULT CURRENT_DATE
);

-- Badges tablosu
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS writing_attempts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  score_content INT,
  score_grammar INT,
  score_vocabulary INT,
  feedback TEXT,
  created_at timestamptz DEFAULT now()
);


