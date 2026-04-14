// Lesson data - 20 structured lessons
export interface Lesson {
  id: number;
  title: string;
  description: string;
  text: string;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: Home Row Basics",
    description: "Learn the home row keys - the foundation of touch typing",
    text: "asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj asdf ;lkj"
  },
  {
    id: 2,
    title: "Lesson 2: Home Row Extended",
    description: "Practice all home row keys including G and H",
    text: "asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh asdfg ;lkjh "
  },
  {
    id: 3,
    title: "Lesson 3: Top Row Basic",
    description: "Learn the top row keys Q W E R T Y U I O P",
    text: "qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu qwer poiu "
  },
  {
    id: 4,
    title: "Lesson 4: Top Row Extended",
    description: "Practice top row with home row combinations",
    text: "qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy qwert poiuy "
  },
  {
    id: 5,
    title: "Lesson 5: Bottom Row Basic",
    description: "Learn the bottom row keys Z X C V B N M",
    text: "zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m zxcv /.,m "
  },
  {
    id: 6,
    title: "Lesson 6: Bottom Row Extended",
    description: "Practice bottom row with mixed combinations",
    text: "zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn zxcvb /.,mn "
  },
  {
    id: 7,
    title: "Lesson 7: All Three Rows",
    description: "Combine home, top, and bottom rows",
    text: "the quick brown fox jumps over the lazy little dog. the quick brown fox jumps over the lazy little dog. the quick brown fox jumps over the lazy little dog. the quick brown fox jumps over the lazy little dog. the quick brown fox jumps over the lazy little dog. the quick brown fox jumps over the lazy little dog"
  },
  {
    id: 8,
    title: "Lesson 8: Numbers Introduction",
    description: "Learn to type numbers 1-5",
    text: "1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 12 34 51 23 45 12 34 51 23 45 123 451 234 512 345 123 451 234 512 345 123 451 234 512 345 1234 5123 4512 3451 2345 1234 5123 4512 3451 2345 12345 12345 1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 12 34 51 23 45 12 34 51 23 45 123 451 234 512 345 123 451 234 512 345 123 451 234 512 345 1234 5123 4512 3451 2345 1234 5123 4512 3451 2345 12345 12345"
  },
  {
    id: 9,
    title: "Lesson 9: Numbers Extended",
    description: "Practice numbers 1-9 and 0",
    text: "1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 123 456 789 012 345 678 901 234 567 890 123 456 789 012 345 678 901 234 567 890 12345 67890 12345 67890 12345 67890 1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 123 456 789 012 345 678 901 234 567 890 123 456 789 012 345 678 901 234 567 890 12345 67890 12345 67890 12345 67890"
  },
  {
    id: 10,
    title: "Lesson 10: Phone Numbers",
    description: "Practice typing phone number patterns",
    text: "9876543210 8765432109 7654321098 011-2345-6789 022-3456-7890 033-4567-8901 9876543210 8765432109 011-2345-6789"
  },
  {
    id: 11,
    title: "Lesson 11: Common Punctuation",
    description: "Learn period, comma, and apostrophe",
    text: "Hello, world. How are you? I am fine, thank you. It is a nice day, isn't it? Yes, it is. Let us go. Hello, world."
  },
  {
    id: 12,
    title: "Lesson 12: More Punctuation",
    description: "Practice semicolon, colon, and quotation marks",
    text: "He said: \"Hello there.\" She replied: \"Hi!\" Items needed: pen; paper; book. Time: 10:30 AM. Date: 15/08/2024."
  },
  {
    id: 13,
    title: "Lesson 13: Simple Words",
    description: "Practice common English words",
    text: "the and for are but not you all can had her was one our out day get has him his how its may new now old see way who"
  },
  {
    id: 14,
    title: "Lesson 14: Common Words Extended",
    description: "More common words for fluency",
    text: "about after being called could first found great house little never other people place right should small still their these think three under water where which while world would years"
  },
  {
    id: 15,
    title: "Lesson 15: Short Sentences",
    description: "Practice typing complete sentences",
    text: "I am happy. You are kind. We like books. They play games. She reads well. He runs fast. The cat is big. Dogs are fun."
  },
  {
    id: 16,
    title: "Lesson 16: Medium Sentences",
    description: "Longer sentences for building speed",
    text: "The sun is shining brightly today. I enjoy reading books in my free time. Learning to type fast is very useful. Practice makes perfect in everything we do. Keep trying and you will succeed."
  },
  {
    id: 17,
    title: "Lesson 17: Paragraph Practice",
    description: "Full paragraph typing practice",
    text: "Typing is an essential skill in today's digital world. With regular practice, anyone can learn to type quickly and accurately. The key is to focus on accuracy first, then gradually increase your speed. Remember to keep your fingers on the home row keys and use all your fingers to type."
  },
  {
    id: 18,
    title: "Lesson 18: Mixed Content",
    description: "Practice letters, numbers, and symbols together",
    text: "Order #12345 was placed on 15/08/2024 for Rs. 2,500. Contact: support@example.com or call 1800-123-4567. Reference: ABC-789. Total items: 5. Delivery by: 20/08/2024."
  },
  {
    id: 19,
    title: "Lesson 19: Speed Building",
    description: "Quick phrases for building typing speed",
    text: "as soon as possible thank you very much please let me know looking forward to hearing from you best regards with reference to in accordance with on behalf of for your information kind regards"
  },
  {
    id: 20,
    title: "Lesson 20: Final Challenge",
    description: "Comprehensive typing challenge combining all skills",
    text: "Dear Sir/Madam, I am writing to apply for the position of Data Entry Operator (Ref: 2024/DEO/001). I have 5 years of experience with a typing speed of 45+ WPM and 98% accuracy. Contact: 9876543210 or email: applicant@email.com. Thank you for considering my application. Yours faithfully, Candidate Name."
  }
];

// Row practice data
export interface RowPractice {
  id: string;
  name: string;
  description: string;
  keys: string;
  practiceText: string;
}

export const rowPractices: RowPractice[] = [
  {
    id: "home-row",
    name: "Home Row",
    description: "Practice the home row keys - the foundation of touch typing",
    keys: "ASDFGHJKL;",
    practiceText: "asdf ;lkj asdf ;lkj fjdk slfa fjdk slfa ghjk ghjk asdf ;lkj fjdk slfa ghjk asdf ;lkj fjdk slfa ghjk asdf ;lkj asdf ;lkj fjdk slfa ghjk asdf ;lkj asdf ghjkl; asdf ghjkl; fghj dksl fghj dksl"
  },
  {
    id: "top-row",
    name: "Top Row",
    description: "Practice the top row keys - Q W E R T Y U I O P",
    keys: "QWERTYUIOP",
    practiceText: "qwer tyui op qwer tyui op wert yuio wert yuio qwer tyui qwer tyui werp werp tory tory quit quit yore yore qwer tyui op wert yuio werp tory quit yore qwer tyui op wert yuio"
  },
  {
    id: "bottom-row",
    name: "Bottom Row",
    description: "Practice the bottom row keys - Z X C V B N M",
    keys: "ZXCVBNM,./",
    practiceText: "zxcv bnm, zxcv bnm, xcvb nm,. xcvb nm,. zxcv bnm, xcvb nm,. zcxv bnm,. zxcv bnm, xcvb nm,. zxcv bnm, xcvb nm,. zxcv bnm, xcvb nm,. zxcv bnm, bnm,. zxcv xcvb nm,. zxcv bnm,"
  }
];

// Pangrams data
export interface Pangram {
  id: number;
  text: string;
  description: string;
}

export const pangrams: Pangram[] = [
  {
    id: 1,
    text: "The quick brown fox jumps over the lazy dog.",
    description: "The most famous English pangram"
  },
  {
    id: 2,
    text: "Pack my box with five dozen liquor jugs.",
    description: "A short and popular pangram"
  },
  {
    id: 3,
    text: "How vexingly quick daft zebras jump!",
    description: "A fun pangram with an exclamation"
  },
  {
    id: 4,
    text: "The five boxing wizards jump quickly.",
    description: "A simple and memorable pangram"
  },
  {
    id: 5,
    text: "Sphinx of black quartz, judge my vow.",
    description: "A mysterious and poetic pangram"
  },
  {
    id: 6,
    text: "Two driven jocks help fax my big quiz.",
    description: "A modern pangram with common words"
  },
  {
    id: 7,
    text: "The jay, pig, fox, zebra and my wolves quack!",
    description: "A playful pangram with animals"
  },
  {
    id: 8,
    text: "Sympathizing would fix Quaker objectives.",
    description: "A formal sounding pangram"
  }
];

// Exam tests data
export type ExamCategory = "GOVT" | "OTHER";

export interface ExamTest {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  text: string;
  noBackspaceDefault: boolean;
  category: ExamCategory;
}

export const examTests: ExamTest[] = [
  // =====================
  // GOVERNMENT EXAMS (15 MIN)
  // =====================

  // SSC CHSL
  {
    id: "ssc-chsl",
    title: "SSC CHSL",
    description: "Staff Selection Commission Combined Higher Secondary Level - LDC/DEO (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The Staff Selection Commission conducts the Combined Higher Secondary Level examination for recruitment to various posts in ministries, departments and offices of the Government of India. The examination is conducted in multiple tiers including a computer based examination and a skill test for typing. Candidates applying for the post of Lower Division Clerk and Data Entry Operator must qualify the typing test with a minimum speed of 35 words per minute in English or 30 words per minute in Hindi. The typing test is conducted on computer and candidates are required to type a given passage within the stipulated time of 15 minutes. Accuracy and speed both are evaluated during the skill test. Candidates should practice regularly to improve their typing speed and minimize errors. The key to success in typing tests is consistent practice and proper finger placement on the keyboard. Touch typing is the most efficient method for achieving high speeds. The home row keys serve as the foundation for proper typing technique. Regular practice sessions of at least one hour daily are recommended for serious aspirants. Government jobs offer excellent career prospects including job security, pension benefits, and opportunities for growth. The Staff Selection Commission has been instrumental in providing employment opportunities to millions of educated youth across the country. Candidates from all states and union territories are eligible to apply for these positions subject to fulfilling the prescribed eligibility criteria."
  },

  // SSC CGL
  {
    id: "ssc-cgl",
    title: "SSC CGL",
    description: "Staff Selection Commission Combined Graduate Level - Group B & C posts (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The Combined Graduate Level Examination conducted by the Staff Selection Commission is one of the most prestigious competitive examinations in India. This examination is held annually to recruit staff for various Group B and Group C posts in ministries, departments and organizations of the Government of India. The examination consists of multiple tiers including computer based tests and skill tests where applicable. For certain posts, candidates are required to demonstrate proficiency in typing and data entry operations. The minimum qualifying speed for typing is 35 words per minute in English and 30 words per minute in Hindi on computer. The skill test is qualifying in nature and candidates must clear this test to be considered for final selection. Preparation for the typing test should begin well in advance of the examination date. Candidates should focus on developing proper typing technique including correct posture and finger placement. The use of all ten fingers is essential for achieving optimal typing speed. Practice with a variety of passages helps candidates become comfortable with different types of content. Government departments require employees who can efficiently handle documentation and correspondence. Typing proficiency is therefore a valuable skill for administrative positions. The examination syllabus covers a wide range of subjects including quantitative aptitude, English language, general awareness and reasoning. Successful candidates are posted in various central government offices throughout the country."
  },

  // RRB NTPC
  {
    id: "rrb-ntpc",
    title: "RRB NTPC",
    description: "Railway Recruitment Board Non-Technical Popular Categories - Various clerical posts (30 WPM)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The Railway Recruitment Boards conduct examinations for Non-Technical Popular Categories to fill various clerical and commercial positions in Indian Railways. This recruitment covers posts such as Junior Clerk cum Typist, Accounts Clerk cum Typist, Junior Time Keeper, Trains Clerk, Commercial cum Ticket Clerk and various other positions. Candidates applying for typing posts must demonstrate a minimum typing speed of 30 words per minute in English or 25 words per minute in Hindi. Indian Railways is one of the largest employers in the world and provides excellent career opportunities for young aspirants. The railway network spans across the entire country connecting major cities and remote areas alike. Employees of Indian Railways enjoy various benefits including housing facilities, medical benefits, travel concessions and pension after retirement. The recruitment process typically involves a computer based test followed by document verification and medical examination. For typing posts, candidates must also clear the skill test conducted on computers. The typing test passage usually consists of general topics related to railways, government schemes or general awareness. Practice is essential for achieving the required typing speed and accuracy. Candidates should use proper typing software and practice with different types of content. The examination is conducted by various Railway Recruitment Boards located in different zones across the country. Millions of candidates apply for these positions making it a highly competitive examination."
  },

  // DSSSB JSA
  {
    id: "dsssb-jsa",
    title: "DSSSB JSA",
    description: "Delhi Subordinate Services Selection Board Junior Secretariat Assistant (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The Delhi Subordinate Services Selection Board conducts examinations for the recruitment of Junior Secretariat Assistants in various departments of the Government of National Capital Territory of Delhi. The post of Junior Secretariat Assistant is equivalent to Lower Division Clerk and involves clerical duties including typing, filing, maintaining records and handling correspondence. Candidates must possess a minimum typing speed of 35 words per minute in English on computer to qualify for this position. The selection process consists of a one tier examination followed by a skill test in typing. The examination tests candidates on general awareness, general intelligence and reasoning ability, arithmetical and numerical ability, and English language. Candidates who qualify the written examination are called for the skill test which is qualifying in nature. Delhi offers numerous employment opportunities in central government offices, state government departments and autonomous bodies. The national capital is home to important ministries and government organizations providing diverse career options. Junior Secretariat Assistants play a crucial role in the functioning of government offices by ensuring smooth administrative operations. They are responsible for maintaining files, drafting letters, data entry and assisting senior officers. Career progression opportunities exist for promotion to higher posts based on experience and performance. Government employment in Delhi provides additional benefits due to the city allowances applicable in the national capital region."
  },

  // KVS JSA
  {
    id: "kvs-jsa",
    title: "KVS JSA",
    description: "Kendriya Vidyalaya Sangathan Junior Secretariat Assistant (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "Kendriya Vidyalaya Sangathan is an autonomous organization under the Ministry of Education, Government of India that manages the chain of central government schools known as Kendriya Vidyalayas. The organization recruits Junior Secretariat Assistants for administrative positions in its regional offices and headquarters. Candidates applying for this position must possess a typing speed of 35 words per minute in English on computer. The recruitment is conducted through a written examination followed by a skill test for typing proficiency. Kendriya Vidyalayas were established to provide quality education to children of central government employees who are transferable across the country. The schools follow a uniform curriculum enabling seamless transfer of students from one school to another. The Sangathan has regional offices in various states to oversee the functioning of schools in their respective regions. Junior Secretariat Assistants in KVS handle administrative tasks including correspondence with schools, maintaining records of students and staff, processing applications and assisting in various administrative matters. Working in an educational organization provides a unique opportunity to contribute to the education sector indirectly. The work environment is generally peaceful and focused on academic and administrative activities. Employees enjoy standard government benefits including medical facilities, leave travel concession and pension benefits. The organization also provides opportunities for career advancement through departmental examinations and promotions."
  },

  // NVS JSA
  {
    id: "nvs-jsa",
    title: "NVS JSA",
    description: "Navodaya Vidyalaya Samiti Junior Secretariat Assistant (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "Navodaya Vidyalaya Samiti is an autonomous organization under the Ministry of Education that runs the Jawahar Navodaya Vidyalayas across India. These residential schools were established to provide quality modern education to talented children predominantly from rural areas regardless of their socio-economic condition. The Samiti recruits Junior Secretariat Assistants for its headquarters and regional offices to handle administrative functions. Candidates must demonstrate a typing speed of 35 words per minute in English to qualify for this position. The selection process involves a written examination testing general awareness, reasoning, quantitative aptitude and English language skills followed by a typing skill test. Jawahar Navodaya Vidyalayas are co-educational residential schools that select students through the Jawahar Navodaya Vidyalaya Selection Test conducted at the district level. The schools provide free boarding and lodging along with uniforms and study materials to selected students. Working in Navodaya Vidyalaya Samiti offers the satisfaction of contributing to the education of rural talented children. The administrative staff plays an important role in ensuring smooth functioning of the schools and regional offices. Duties include maintaining records, processing student applications, handling correspondence and assisting in various administrative activities. The organization follows government pay scales and provides all standard benefits applicable to central government employees. Career growth opportunities exist through departmental promotions and examinations."
  },

  // DELHI HIGH COURT
  {
    id: "delhi-high-court",
    title: "DELHI HIGH COURT",
    description: "Delhi High Court Junior Judicial Assistant / Restorer (35 WPM English)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The High Court of Delhi conducts recruitment for various positions including Junior Judicial Assistants and Restorers in the Delhi Higher Judicial Service. These positions are crucial for the functioning of the judicial system in the National Capital Territory of Delhi. Candidates applying for clerical positions must possess a minimum typing speed of 35 words per minute in English on computer. The selection process consists of a written examination followed by a typing test and personal interview. The High Court handles a wide range of cases including civil disputes, criminal appeals, constitutional matters and writ petitions. Junior Judicial Assistants are responsible for maintaining case records, preparing cause lists, handling legal documents and assisting judicial officers in their day-to-day work. The work requires attention to detail and accuracy as legal documents must be precise and error-free. Working in the judiciary provides an opportunity to be part of the justice delivery system and contribute to upholding the rule of law. The courts handle sensitive matters requiring confidentiality and professionalism from all staff members. Employees of the Delhi High Court enjoy attractive salary packages along with benefits such as medical facilities, housing allowances and pension. The prestigious nature of judicial service attracts many candidates making it a competitive recruitment process. Candidates should prepare thoroughly for both the written examination and typing test to succeed."
  },

  // DP HCM (Delhi Police Head Constable Ministerial)
  {
    id: "dp-hcm",
    title: "DP HCM",
    description: "Delhi Police Head Constable Ministerial (30 WPM English / 25 WPM Hindi)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "Delhi Police conducts recruitment for Head Constable Ministerial positions to handle administrative and clerical work in various police stations and offices across Delhi. The ministerial staff in Delhi Police plays a vital role in maintaining records, preparing reports, handling correspondence and managing administrative tasks. Candidates must possess a minimum typing speed of 30 words per minute in English or 25 words per minute in Hindi on computer. The selection process includes a computer based test, physical endurance and measurement test, typing test and medical examination. Delhi Police is one of the largest metropolitan police forces in the world responsible for maintaining law and order in the national capital. The ministerial cadre provides essential support to the operational staff by ensuring proper documentation and record keeping. Head Constables Ministerial are posted in police stations, district offices, police headquarters and various specialized units. The work involves maintaining case diaries, typing FIRs and legal documents, handling public grievances and assisting investigating officers. Working in Delhi Police provides job security along with the satisfaction of serving in a vital public service organization. Employees receive government salaries along with allowances applicable to police personnel. The uniform service commands respect in society and provides opportunities for career advancement through promotions. Candidates should practice typing regularly and prepare for the written examination covering general knowledge, reasoning and mathematics."
  },

  // STENO Exams
  {
    id: "ssc-steno-grade-c",
    title: "SSC Stenographer Grade C",
    description: "Staff Selection Commission Stenographer Grade C (100 WPM Shorthand, 40 WPM Typing)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "The Staff Selection Commission conducts examinations for Stenographer Grade C and Grade D positions in various ministries and departments of the Government of India. Stenographers are skilled professionals who can take dictation in shorthand and transcribe it accurately using a computer. For Grade C positions, candidates must demonstrate a shorthand speed of 100 words per minute and typing speed of 40 words per minute. The skill test involves taking dictation in shorthand for 10 minutes and transcribing it on computer within 40 minutes for English and 55 minutes for Hindi. Stenographers play a crucial role in government offices by recording proceedings of meetings, transcribing official documents and assisting senior officers with correspondence. The position requires excellent language skills, concentration and the ability to work under pressure. Stenography is a specialized skill that requires dedicated practice over an extended period to master. Candidates typically spend several months learning shorthand symbols and developing speed through regular dictation practice. The written examination tests general intelligence and reasoning, general awareness and English language or Hindi language skills. After qualifying the written test, candidates must pass the skill test to be considered for appointment. Government stenographer positions offer attractive salary packages and opportunities for career advancement. With experience, stenographers can be promoted to Personal Assistant and Private Secretary positions."
  },

  {
    id: "ssc-steno-grade-d",
    title: "SSC Stenographer Grade D",
    description: "Staff Selection Commission Stenographer Grade D (80 WPM Shorthand, 35 WPM Typing)",
    duration: 900,
    noBackspaceDefault: true,
    category: "GOVT",
    text: "Stenographer Grade D positions are entry-level stenography posts in the Government of India recruited through the Staff Selection Commission. These positions require candidates to have a shorthand speed of 80 words per minute and typing speed of 35 words per minute on computer. The skill test is conducted after candidates qualify the computer based examination. During the skill test, candidates take dictation for 10 minutes and then transcribe it within 50 minutes for English and 65 minutes for Hindi. Stenographer Grade D posts are available in various central government ministries, departments, attached and subordinate offices. The work involves taking dictation from officers, transcribing documents, maintaining confidential files and assisting with day-to-day office work. Stenography requires good command over the language and the ability to quickly convert spoken words into shorthand symbols. New aspirants should start by learning the basic shorthand theory and then gradually build speed through regular practice. Dictation practice with gradually increasing speed is essential for developing proficiency. Many coaching institutes and online resources are available for learning shorthand and preparing for the examination. Government stenographer posts provide excellent job security and benefits including pension, medical facilities and travel allowances. The initial pay scale is attractive with opportunities for promotion to higher grades based on performance and experience in the department."
  },

  // =====================
  // OTHER PRACTICE TESTS
  // =====================

  {
    id: "practice-english-basic",
    title: "Basic English Practice",
    description: "Simple English passage for beginners - Build your foundation",
    duration: 300,
    noBackspaceDefault: false,
    category: "OTHER",
    text: "India is a country of diverse cultures and traditions. The nation has made remarkable progress in various fields since independence. Education plays a vital role in the development of our country. Many young people are now pursuing careers in technology and innovation. The government has launched several initiatives to promote digital literacy among citizens. With hard work and dedication, India continues to grow as a global leader in the modern world. Our democratic values ensure freedom and equality for all citizens. The unity in diversity makes India truly unique among nations."
  },

  {
    id: "practice-numeric",
    title: "Numeric Data Entry",
    description: "Number practice for data entry positions - Improve your number pad speed",
    duration: 300,
    noBackspaceDefault: false,
    category: "OTHER",
    text: "12345 67890 11223 34455 66778 89900 12345 67890 24680 13579 98765 43210 55555 77777 99999 11111 33333 44444 66666 88888 10203 40506 70809 12121 34343 56565 78787 90909 24682 46824 68246 82468 13579 35791 57913 79135 91357 86420 97531 08642 19753 20864 31975 42086 53197 64208 75319 86420 97531 12345 67890 23456 78901 34567 89012 45678 90123 56789 01234"
  },

  {
    id: "practice-mixed-content",
    title: "Mixed Content Practice",
    description: "Letters, numbers and symbols combined - Comprehensive practice",
    duration: 600,
    noBackspaceDefault: false,
    category: "OTHER",
    text: "Order #12345 dated 15/08/2024 for Rs. 25,000/- placed by Customer ID: CUST-789-ABC. Contact: support@example.com or call 1800-123-4567. Reference: ORD/2024/001. Items ordered: 5 units @ Rs. 5,000 each. Delivery address: 123, Main Street, New Delhi - 110001. GST: 18% applicable. Total amount: Rs. 29,500/- including taxes. Payment mode: Online (UPI/NEFT/RTGS). Bank details: Account No. 1234567890, IFSC: ABCD0001234. Expected delivery: 20/08/2024. For queries, email: orders@company.in or visit www.company.com. Customer care available Mon-Sat, 9 AM to 6 PM."
  },

  {
    id: "practice-hindi-transliteration",
    title: "Hindi Transliteration",
    description: "English transliteration of Hindi text - For Hindi typing practice",
    duration: 300,
    noBackspaceDefault: false,
    category: "OTHER",
    text: "Bharat ek mahan desh hai. Yahan anek bhashayen boli jaati hain. Hindi hamari rashtrabhasha hai. Shiksha sabhi ke liye zaruri hai. Computer aaj ki duniya mein bahut mahatvapurn hai. Typing sikhna ek upyogi kaushal hai. Rojana abhyas karne se gati badhti hai. Sahi tarike se practice karna chahiye. Sabhi ungliyon ka upyog karna seekhein. Dhairya aur mehnat se safalta milti hai. Sarkari naukri paane ke liye typing test dena zaroori hai. Abhyas se hi hum apni gati badha sakte hain."
  },

  {
    id: "practice-speed-building",
    title: "Speed Building Test",
    description: "Common phrases and sentences - Build your typing speed",
    duration: 600,
    noBackspaceDefault: false,
    category: "OTHER",
    text: "As soon as possible, please let me know your availability for the meeting scheduled next week. Thank you very much for your prompt response to our previous communication. Looking forward to hearing from you at the earliest convenience. Best regards and warm wishes for the upcoming festive season. With reference to your letter dated the fifteenth instant regarding the pending matter. In accordance with the guidelines issued by the competent authority on this subject. On behalf of the entire team, we extend our sincere gratitude for your continued support. For your kind information and necessary action at your end please. Kind regards and please do not hesitate to contact us for any clarification required. The matter has been examined and the following observations are submitted for consideration."
  }
];
