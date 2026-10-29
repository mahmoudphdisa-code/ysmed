export interface EngineeringServiceItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  icon: string;
  image: string;
  highlightAr: string;
  highlightEn: string;
  featuresAr: string[];
  featuresEn: string[];
  tags: string[];
}

export const engineeringServices: EngineeringServiceItem[] = [
  {
    id: "grad-support",
    slug: "graduation-projects",
    titleAr: "دعم وتوجيه مشاريع التخرج",
    titleEn: "Graduation Project Technical Support",
    shortDescAr: "إشراف ودعم فني استشاري وتنفيذي لمشاريع تخرج كليات الهندسة والحاسبات والذكاء الاصطناعي.",
    shortDescEn: "Comprehensive mentorship and technical support for engineering and computer science graduation projects.",
    icon: "GraduationCap",
    image: "/images/services/grad-projects.jpg",
    highlightAr: "توجيه معماري وتصحيح أخطاء وتكامل عملي",
    highlightEn: "Architecture guidance, debugging & practical integration",
    featuresAr: [
      "بناء ومراجعة المعمارية الفنية للنظام (System Architecture)",
      "المساعدة في كتابة وتحسين أكواد السوفتوير والأنظمة المدمجة",
      "استكشاف الأخطاء البرمجية والإلكترونية وحلها عملياً (Debugging)",
      "تكامل الهاردوير مع السوفتوير وقواعد البيانات والسحابة",
      "إعداد وتجهيز الاختبارات التجريبية والعرض التقديمي للمناقشة",
      "تحسين الأداء وضمان استقرار تشغيل النموذج وقت التحكيم",
    ],
    featuresEn: [
      "System architecture design and engineering review",
      "Software & embedded system coding assistance",
      "Hardware and software debugging and troubleshooting",
      "Seamless hardware-software-cloud integration",
      "Testing, validation, and defense presentation preparation",
      "Performance optimization for stable live demonstrations",
    ],
    tags: ["Graduation", "Mentorship", "Architecture", "Defense Ready"],
  },
  {
    id: "hardware-eng",
    slug: "hardware-engineering",
    titleAr: "الهندسة الإلكترونية والأنظمة المدمجة",
    titleEn: "Hardware Engineering & Embedded Systems",
    shortDescAr: "تصميم الدوائر الإلكترونية، برمجة المتحكمات الدقيقة، أنظمة IoT، الروبوتات، وبوردات PCB.",
    shortDescEn: "Electronic circuit design, microcontroller programming, IoT systems, robotics, and custom PCBs.",
    icon: "Cpu",
    image: "/images/services/hardware-eng.jpg",
    highlightAr: "Arduino, ESP32, STM32, ARM, PCB Design",
    highlightEn: "Arduino, ESP32, STM32, ARM & PCB Layouts",
    featuresAr: [
      "تطوير وبرمجة المتحكمات: Arduino, ESP32, STM32, Raspberry Pi",
      "برمجة الأنظمة المدمجة (Embedded C / C++ / MicroPython / RTOS)",
      "تصميم دوائر PCB متقدمة واختيار المكونات الصناعية الموثوقة",
      "أنظمة إنترنت الأشياء الصناعية (IoT) وبروتوكولات MQTT, LoRa, BLE",
      "تكامل الحساسات الدقيقة (Sensors) والمحركات والـ Actuators",
      "دوائر التغذية والحماية الكهربائية واستقرار الإشارات",
    ],
    featuresEn: [
      "Microcontroller development: Arduino, ESP32, STM32, Raspberry Pi",
      "Embedded firmware (Embedded C / C++ / MicroPython / RTOS)",
      "Multi-layer PCB schematic design & industrial component selection",
      "Industrial IoT telemetry via MQTT, LoRaWAN, BLE & Wi-Fi",
      "High-precision sensor integration and motor/actuator control",
      "Power management, electrical protection & signal conditioning",
    ],
    tags: ["Embedded Systems", "PCB Design", "IoT", "Microcontrollers"],
  },
  {
    id: "software-dev",
    slug: "software-development",
    titleAr: "تطوير البرمجيات والذكاء الاصطناعي",
    titleEn: "Software Development & Applied AI",
    shortDescAr: "تطبيقات ويب وموبايل فائقة السرعة، أنظمة الذكاء الاصطناعي، الرؤية الحاسوبية، ولوحات التحكم.",
    shortDescEn: "Ultra-fast web & mobile applications, applied AI, computer vision, and telemetry dashboards.",
    icon: "Code2",
    image: "/images/services/software-dev.jpg",
    highlightAr: "Web, Mobile, AI/ML, Computer Vision & Cloud APIs",
    highlightEn: "Web, Mobile, AI/ML, Computer Vision & Cloud APIs",
    featuresAr: [
      "تطوير منصات ويب تفاعلية متقدمة (React, Next.js, Node.js, Python)",
      "تطبيقات هواتف ذكية (iOS & Android) للتحكم بالأجهزة ومراقبتها",
      "نماذج ذكاء اصطناعي وتعلم آلة (AI & Machine Learning)",
      "أنظمة الرؤية الحاسوبية ومعالجة الصور (Computer Vision / YOLO)",
      "قواعد بيانات سريعة وواجهات برمجية متزامنة (APIs & Supabase)",
      "ربط السوفتوير بالهاردوير في الوقت الفعلي (Realtime WebSockets/MQTT)",
    ],
    featuresEn: [
      "Modern high-performance web applications (React, Next.js, Python)",
      "Mobile apps (iOS & Android) for remote control & monitoring",
      "Custom AI, machine learning & predictive analytics models",
      "Computer vision & image processing solutions (OpenCV / YOLO)",
      "Scalable databases, secure backends & REST/GraphQL APIs",
      "Real-time bidirectional hardware/software communication",
    ],
    tags: ["Web & Mobile", "AI & ML", "Computer Vision", "Realtime"],
  },
  {
    id: "manufacturing",
    slug: "project-manufacturing",
    titleAr: "تصنيع وتجميع المشاريع الكاملة",
    titleEn: "Complete Project Manufacturing & Assembly",
    shortDescAr: "توريد المكونات، تصنيع ولحام بوردات PCB، طباعة هياكل 3D، وتجميع النظام بالكامل مع الاختبار.",
    shortDescEn: "Component procurement, PCB fabrication, SMT assembly, 3D printed enclosures, and final QA.",
    icon: "Factory",
    image: "/images/services/manufacturing.jpg",
    highlightAr: "تصنيع حقيقي من الدائرة إلى الهيكل الخارجي",
    highlightEn: "End-to-end fabrication from circuits to custom enclosures",
    featuresAr: [
      "تأمين وتوريد المكونات الإلكترونية الأصلية والحساسات النادرة",
      "تصنيع بوردات PCB باحترافية ولحام يدوي وآلي دقيق (SMT / THT)",
      "تصميم وتصنيع الهياكل والكيسات بالطباعة ثلاثية الأبعاد (3D Enclosures)",
      "التقطيع بالليزر وتفصيل الأجزاء الميكانيكية الداعمة",
      "التوصيلات الكهربائية والأسلاك المعزولة وفق المعايير الصناعية",
      "فحص تشغيلي شامل واختبارات الجهد والحرارة وضمان الجودة (QA)",
    ],
    featuresEn: [
      "Genuine electronic components & specialized sensor procurement",
      "Professional PCB fabrication, precision soldering & SMT assembly",
      "Custom 3D-printed industrial casings & modular enclosures",
      "Laser cutting & mechanical bracket fabrication",
      "Clean industrial-grade internal wiring & harness routing",
      "Rigorous functional load testing, stress checks & QA reports",
    ],
    tags: ["PCB Fabrication", "3D Printing", "Assembly", "Quality Assurance"],
  },
  {
    id: "prototyping",
    slug: "prototype-development",
    titleAr: "تطوير النماذج الأولية المخصصة",
    titleEn: "Custom Prototype Development (PoC & MVP)",
    shortDescAr: "تحويل الأفكار الإبداعية والابتكارات لطلاب، باحثين، رواد أعمال، وشركات إلى نماذج حقيقية تعمل.",
    shortDescEn: "Transforming innovative ideas into working hardware and software proofs of concept and MVPs.",
    icon: "Sparkles",
    image: "/images/services/prototyping.jpg",
    highlightAr: "من الفكرة على الورق إلى نموذج حي يعمل ومقنع للمستثمرين",
    highlightEn: "From napkin sketch to an investor-ready functional prototype",
    featuresAr: [
      "دراسة الجدوى الفنية وتقييم قابلية التنفيذ الهندسي (Feasibility)",
      "تصميم معمارية النموذج الأولي وخطة العمل المرحلية",
      "بناء نموذج إثبات المفهوم التشغيلي (Proof of Concept - PoC)",
      "تطوير النسخة الأولية القابلة للإطلاق (Minimum Viable Product - MVP)",
      "تكامل الأجزاء الميكانيكية والإلكترونية والبرمجية كوحدة واحدة",
      "تسليم النموذج مع وثائق التشغيل والمخططات ومصادر الكود",
    ],
    featuresEn: [
      "Technical feasibility assessment & component feasibility study",
      "Prototype architecture design and phased milestone roadmap",
      "Rapid Proof of Concept (PoC) validation build",
      "Functional Minimum Viable Product (MVP) for investor demonstrations",
      "Holistic mechanical, electronic, and software unification",
      "Complete delivery with schematics, source code, and user manual",
    ],
    tags: ["Prototypes", "Proof of Concept", "Startups", "Turnkey Solution"],
  },
  {
    id: "consulting",
    slug: "technical-consulting",
    titleAr: "الاستشارات الفنية واستكشاف الأعطال",
    titleEn: "Technical Consulting & Troubleshooting",
    shortDescAr: "جلسات استشارية هندسية متخصصة، تدقيق المشاريع، فحص الأعطال المعقدة، ورفع كفاءة الأداء.",
    shortDescEn: "Specialized engineering consultations, system audits, deep debugging, and performance optimization.",
    icon: "Wrench",
    image: "/images/services/consulting.jpg",
    highlightAr: "حلول دقيقة للمشاكل المستعصية والتشويش والبرمجة",
    highlightEn: "Precision solutions for elusive bugs, electrical noise & stability",
    featuresAr: [
      "استشارات هندسية مباشرة مع مهندسين ذوي خبرة متقدمة",
      "تقييم الأنظمة والمخططات قبل التصنيع لتجنب الخسائر والأخطاء",
      "كشف وتصحيح أعطال الهاردوير (تشويش الإشارة، احتراق الدوائر، نقص التغذية)",
      "إصلاح الثغرات البرمجية والتهنيج في الأنظمة المدمجة والتطبيقات",
      "إرشادات الترقية وتحسين السرعة واستهلاك الطاقة",
      "تجهيز التقارير الفنية المتخصصة وملفات التوثيق الهندسي",
    ],
    featuresEn: [
      "Direct 1-on-1 consultations with seasoned senior engineers",
      "Pre-production design reviews to eliminate costly flaws",
      "Hardware fault isolation: signal noise, thermal issues & power rails",
      "Firmware crash analysis, memory leaks & communication freezes",
      "System efficiency, latency, and battery power optimization",
      "Comprehensive technical documentation and audit reports",
    ],
    tags: ["Consulting", "Troubleshooting", "System Audit", "Optimization"],
  },
];

export interface CapabilityItem {
  id: string;
  category: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  technologies: string[];
}

export const capabilitiesList: CapabilityItem[] = [
  {
    id: "cap-embedded",
    category: "Hardware",
    titleAr: "الأنظمة المدمجة (Embedded Systems)",
    titleEn: "Embedded Systems & Firmware",
    descAr: "برمجة المتحكمات الدقيقة معالجات ARM و STM32 و ESP32 و Arduino وتطوير أنظمة التشغيل اللحظية FreeRTOS.",
    descEn: "Firmware development across STM32, ESP32, ARM Cortex, and Arduino with FreeRTOS multitasking.",
    icon: "Cpu",
    technologies: ["STM32", "ESP32", "Arduino", "FreeRTOS", "C/C++", "UART/SPI/I2C"],
  },
  {
    id: "cap-robotics",
    category: "Robotics",
    titleAr: "الروبوتات والأتمتة (Robotics)",
    titleEn: "Robotics & Motion Control",
    descAr: "تصميم وبرمجة الروبوتات الذكية، الأذرع الآلية، مركبات AGV، ومحركات السيرفو والستيبير الدقيقة.",
    descEn: "Autonomous mobile robots, 6-DOF robotic arms, AGVs, PID control, stepper and servo integration.",
    icon: "Bot",
    technologies: ["ROS / ROS2", "Kinematics", "Servo Motors", "Stepper Drivers", "Encoders", "LIDAR"],
  },
  {
    id: "cap-electronics",
    category: "Hardware",
    titleAr: "الإلكترونيات والدوائر التناظرية",
    titleEn: "Electronics & Circuit Design",
    descAr: "تصميم دوائر التغذية المنظمة، معالجة الإشارات الضعيفة، العزل البصري، وحماية الدوائر الحساسة.",
    descEn: "Power management, analog signal filtering, opto-isolation, protection circuits, and sensor conditioning.",
    icon: "Zap",
    technologies: ["Analog Circuits", "Switching Regulators", "Optocouplers", "Relay Arrays", "Signal Filters"],
  },
  {
    id: "cap-pcb",
    category: "Hardware",
    titleAr: "تصميم وتصنيع بوردات PCB",
    titleEn: "PCB Design & Fabrication",
    descAr: "رسم المخططات وتوزيع المسارات متعددة الطبقات واختبار سلامة الإشارات مع تصنيع احترافي.",
    descEn: "Multi-layer schematic capture, PCB layout, high-frequency signal routing, and Gerber generation.",
    icon: "Layers",
    technologies: ["KiCad", "Altium Designer", "Eagle", "SMT Assembly", "Gerber Files", "IPC Standards"],
  },
  {
    id: "cap-iot",
    category: "IoT",
    titleAr: "إنترنت الأشياء (Internet of Things)",
    titleEn: "Industrial & Consumer IoT",
    descAr: "ربط الأجهزة الذكية بالسحابة لمتابعة البيانات والتحكم عن بعد عبر بروتوكولات الاتصال اللاسلكي.",
    descEn: "Secure telemetry, remote actuator triggering, cloud bridging, and low-power mesh networks.",
    icon: "Wifi",
    technologies: ["MQTT", "LoRaWAN", "BLE 5.0", "Wi-Fi", "WebSockets", "HTTP REST", "CoAP"],
  },
  {
    id: "cap-ai",
    category: "AI",
    titleAr: "الذكاء الاصطناعي وتعلم الآلة",
    titleEn: "Artificial Intelligence & ML",
    descAr: "نماذج التنبؤ، التصنيف، ومعالجة البيانات الحساسة ونشر خوارزميات الذكاء الاصطناعي على الحافة (Edge AI).",
    descEn: "Predictive maintenance models, time-series forecasting, TinyML, and edge computing inference.",
    icon: "Brain",
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "TinyML", "Edge Impulse"],
  },
  {
    id: "cap-cv",
    category: "AI",
    titleAr: "الرؤية الحاسوبية (Computer Vision)",
    titleEn: "Computer Vision & Visual QA",
    descAr: "اكتشاف الأجسام، التعرف على الوجوه، تتبع الحركة، وفرز العيوب الصناعية بدقة وسرعة عالية.",
    descEn: "Object detection, YOLO models, industrial quality inspection, facial recognition, and optical tracking.",
    icon: "Eye",
    technologies: ["OpenCV", "YOLOv8", "Deep Learning", "Camera Interfaces", "MediaPipe"],
  },
  {
    id: "cap-web",
    category: "Software",
    titleAr: "تطوير تطبيقات الويب ولوحات التحكم",
    titleEn: "Web Applications & Dashboards",
    descAr: "واجهات مستخدم سريعة وعصرية مع رسوم بيانية ومتابعة لحظية للأجهزة والمستشعرات.",
    descEn: "Real-time engineering dashboards, responsive portals, device managers, and charting suites.",
    icon: "Globe",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Recharts", "Supabase"],
  },
  {
    id: "cap-mobile",
    category: "Software",
    titleAr: "تطبيقات الهواتف الذكية",
    titleEn: "Mobile Control Applications",
    descAr: "تطبيقات مخصصة لنظامي Android و iOS للاتصال بالأجهزة عبر Bluetooth و Wi-Fi وعبر السحابة.",
    descEn: "Native and hybrid cross-platform apps with direct Bluetooth LE and cloud synchronization.",
    icon: "Smartphone",
    technologies: ["React Native", "Flutter", "BLE Libraries", "Push Notifications", "Biometrics"],
  },
  {
    id: "cap-automation",
    category: "Hardware",
    titleAr: "الأتمتة الصناعية والتحكم",
    titleEn: "Industrial Automation & SCADA",
    descAr: "برمجة أجهزة PLC، ربط بروتوكولات Modbus و RS485، والتحكم في خطوط الإنتاج والسيور.",
    descEn: "PLC logic, Modbus RTU/TCP telemetry, RS485 busing, industrial sensors, and relays.",
    icon: "Cog",
    technologies: ["Modbus", "RS485", "PLC", "Industrial Sensors", "SSR Relays", "VFD Drives"],
  },
  {
    id: "cap-3d",
    category: "Prototyping",
    titleAr: "الطباعة ثلاثية الأبعاد والكيسات",
    titleEn: "3D Printing & Enclosures",
    descAr: "نمذجة ثلاثية الأبعاد CAD وطباعة أجزاء ميكانيكية وهياكل حماية دقيقة بأجود الخامات (PLA, PETG, ABS).",
    descEn: "Parametric CAD design and rapid additive manufacturing using tough engineering filaments.",
    icon: "Box",
    technologies: ["Fusion 360", "SolidWorks", "FDM / SLA", "PETG / ABS / PLA", "Threaded Inserts"],
  },
  {
    id: "cap-proto",
    category: "Prototyping",
    titleAr: "تصنيع وتجميع النماذج الأولية",
    titleEn: "Full Prototype Fabrication",
    descAr: "تكامل كامل للمكونات الميكانيكية والإلكترونية والبرمجية واختبارها تحت ظروف التشغيل الفعلية.",
    descEn: "Turnkey hardware and software integration, wire harnessing, calibration, and rigorous load trials.",
    icon: "Wrench",
    technologies: ["Rapid Prototyping", "Wire Harnessing", "Bench Testing", "Thermal Cameras", "Oscilloscopes"],
  },
];

export interface ProcessStep {
  step: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
}

export const processTimeline: ProcessStep[] = [
  {
    step: 1,
    titleAr: "إرسال الفكرة والمتطلبات",
    titleEn: "Submit Project Requirements",
    descAr: "املأ نموذج الطلب موضحاً فكرة المشروع، الأهداف المرجوة، الخدمات المطلوبة، والموعد المفضل للتسليم.",
    descEn: "Fill out the project request form detailing your core idea, required services, and completion deadline.",
    icon: "FileSpreadsheet",
  },
  {
    step: 2,
    titleAr: "إرفاق الملفات والمخططات",
    titleEn: "Upload Schematics & Documents",
    descAr: "أرفق المخططات، أوراق العمل، أكواد المصدر، أو ملفات CAD إن وجدت لتمكين فريقنا من الفحص الدقيق.",
    descEn: "Upload existing circuit schematics, source code, CAD models, or academic guidelines for deep review.",
    icon: "UploadCloud",
  },
  {
    step: 3,
    titleAr: "المراجعة الهندسية الفنية",
    titleEn: "Engineering Assessment",
    descAr: "يقوم مهندسونا المتخصصون بمراجعة متطلباتك، فحص الجدوى الفنية، وتحديد أدق المكونات والحلول.",
    descEn: "Our senior engineering team assesses project feasibility, architecture, and selects ideal components.",
    icon: "SearchCheck",
  },
  {
    step: 4,
    titleAr: "عرض الحل الفني والمقايسة",
    titleEn: "Technical Plan & Quotation",
    descAr: "نرسل لك تفصيلاً فنياً لخطة العمل، المخرجات المتوقعة، والجدول الزمني وعرض السعر الشفاف.",
    descEn: "Receive a clear scope of work, technical deliverables, development timeline, and transparent quote.",
    icon: "ReceiptCheck",
  },
  {
    step: 5,
    titleAr: "الموافقة وبدء التنفيذ الهندسي",
    titleEn: "Approval & Development Kickoff",
    descAr: "بعد اعتمادك للمقايسة، يبدأ فريقنا في التصميم والبرمجة والتصنيع والتجميع وفق المعايير القياسية.",
    descEn: "Upon scope approval, our specialized engineers begin circuit design, coding, fabrication, and assembly.",
    icon: "Rocket",
  },
  {
    step: 6,
    titleAr: "المتابعة والاختبار والتسليم",
    titleEn: "Progress Tracking & Delivery",
    descAr: "تابع تقدم مشروعك خطوة بخطوة عبر لوحة العميل، تواصل مباشرة مع المهندسين، واستلم مشروعاً موثوقاً يعمل بكفاءة.",
    descEn: "Track live milestones via your customer portal, chat with the engineers, and receive your verified project.",
    icon: "CheckCircle",
  },
];

export interface FAQItem {
  id: string;
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

export const faqList: FAQItem[] = [
  {
    id: "faq-1",
    qAr: "هل يمكنني طلب الدعم لمشروع تخرج أو نموذج قائم بالفعل ويواجه أعطالاً؟",
    qEn: "Can I request support for an existing project that has bugs or issues?",
    aAr: "نعم بالتأكيد! نقدم خدمات الفحص الهندسي والتدقيق (Code Review & Hardware Troubleshooting) لأي مشروع قائم، سواء كان العطل برمجياً في الكود، أو عدم استقرار في إشارات الدوائر الإلكترونية، أو مشاكل في ربط الحساسات والمتحكمات.",
    aEn: "Yes, absolutely! We provide comprehensive debugging and system auditing for existing projects, whether you are dealing with software bugs, electrical noise, power fluctuations, or sensor communication failures.",
  },
  {
    id: "faq-2",
    qAr: "هل تقومون بتصنيع وتجميع نموذج هاردوير كامل وجاهز للتشغيل؟",
    qEn: "Can you manufacture and assemble a complete, fully functional hardware prototype?",
    aAr: "نعم، نقدم خدمة التصنيع والتجميع المتكامل (Turnkey Manufacturing)، وتشمل توريد المكونات الأصلية، تصنيع ولحام بوردات PCB، طباعة الكيسات والهياكل ثلاثية الأبعاد (3D Enclosures)، والتوصيل الداخلي المنظم، مع الفحص التشغيلي الكامل وضمان الجودة قبل التسليم.",
    aEn: "Yes, we provide end-to-end turnkey manufacturing. This covers sourcing authentic components, PCB fabrication and soldering, 3D printing custom enclosures, internal harness routing, and rigorous bench testing before handover.",
  },
  {
    id: "faq-3",
    qAr: "هل أستطيع تقديم طلبي إذا كانت فكرتي مجرد تصور ولم أجهز مستندات فنية بعد؟",
    qEn: "Can I submit a project idea if I only have a concept and no technical documentation?",
    aAr: "نعم، يسعدنا مساعدتك في صياغة الفكرة وتحويلها إلى متطلبات تقنية دقيقة. في نموذج الطلب، اختر مرحلة المشروع 'مجرد فكرة' وسيتواصل معك مهندسونا لمناقشة التفاصيل واقتراح المعمارية الهندسية الأنسب وتحديد المكونات المطلوبة.",
    aEn: "Yes! You can select 'Idea only' in the request form. Our engineering consultants will discuss your vision, help define technical specifications, suggest optimal components, and architect the development roadmap.",
  },
  {
    id: "faq-4",
    qAr: "ما هي صيغ الملفات والمخططات التي يمكنني إرفاقها مع الطلب؟",
    qEn: "What file formats can I attach with my project request?",
    aAr: "يدعم نظام الرفع الآمن معظم الصيغ الهندسية والبرمجية بما في ذلك: ملفات PDF و Word، الصور والمخططات التوضيحية (PNG, JPG)، ملفات الدوائر والـ PCB (ملفات Gerber و KiCad و Eagle)، ملفات التصميم ثلاثي الأبعاد CAD و STL، بالإضافة إلى أرشيفات الكود المصدر (ZIP).",
    aEn: "Our secure upload vault supports PDF and Word documents, schematics and diagrams (PNG, JPG), PCB Gerber and KiCad/Eagle files, 3D CAD models (STL, STEP), and compressed source code archives (ZIP).",
  },
  {
    id: "faq-5",
    qAr: "كيف يتم تحديد التكلفة وإرسال عرض السعر (Quotation)؟",
    qEn: "How is the project cost determined and when do I receive a quotation?",
    aAr: "نظراً لأن المشاريع الهندسية تختلف تماماً في متطلباتها، فإن السعر يتحدد بدقة بناءً على المكونات الإلكترونية المطلوبة، ساعات التطوير والبرمجة، تكلفة تصنيع الـ PCB والكيسات، ومستوى الدعم المطلوب. نرسل لك عرض سعر تفصيلي ومحدد البنود خلال 24 إلى 48 ساعة من مراجعة طلبك.",
    aEn: "Because engineering projects vary widely in scope, cost depends on component costs, firmware/software development hours, PCB and enclosure manufacturing, and required testing. We provide a transparent, itemized quotation within 24 to 48 hours of reviewing your specs.",
  },
  {
    id: "faq-6",
    qAr: "هل أستطيع متابعة مراحل تنفيذ مشروعي والتواصل مع المهندس المسؤول؟",
    qEn: "Can I track my project's progress and communicate directly with the engineering team?",
    aAr: "نعم، نوفر لك بوابة عملاء مخصصة 'مشاريعي' (My Projects)، تتيح لك متابعة التحديثات اللحظية، والاطلاع على مراحل الإنجاز (Milestones)، وتبادل الرسائل والملفات مع الفريق الهندسي في محادثة موثقة وسريعة.",
    aEn: "Yes! You will have access to a dedicated 'My Projects' portal where you can monitor real-time progress, view milestone completions, approve quotations, and exchange direct messages and files with the engineering team.",
  },
  {
    id: "faq-7",
    qAr: "هل تدعمون المشاريع الهجينة التي تجمع بين الهاردوير والسوفتوير والذكاء الاصطناعي؟",
    qEn: "Do you support hybrid projects combining hardware, software, and AI?",
    aAr: "هذا هو صميم تخصصنا الرئيسي! نحن نتميز بربط الأنظمة المدمجة مع تطبيقات الويب والموبايل وخوارزميات الرؤية الحاسوبية والذكاء الاصطناعي، لتشغيل حلول متكاملة تتبادل البيانات بسلاسة وتعمل في الوقت الحقيقي.",
    aEn: "This is our primary specialty! We excel at bridging embedded microcontrollers with high-speed web and mobile interfaces, cloud databases, and computer vision / AI models into a unified, synchronized system.",
  },
  {
    id: "faq-8",
    qAr: "هل أفكاري الهندسية وملفاتي ومصادر الكود محمية وتحت بند السرية؟",
    qEn: "Are my engineering ideas, design files, and source code strictly confidential?",
    aAr: "نعم 100%. نلتزم بأعلى معايير السرية وحماية الملكية الفكرية. لا يتم مشاركة بيانات أي مشروع أو أكواده أو مخططاته مع أي طرف ثالث، ونوقع اتفاقية عدم إفصاح وسرية (NDA) عند الطلب لحفظ كامل حقوقك.",
    aEn: "100% yes. We strictly respect project confidentiality and intellectual property. Your files, ideas, and code are never shared with any third party, and we gladly execute a Non-Disclosure Agreement (NDA) upon request.",
  },
];

export const projectCategories = [
  { value: "robotics", labelAr: "الروبوتات والأذرع الآلية", labelEn: "Robotics & Automation" },
  { value: "embedded_systems", labelAr: "الأنظمة المدمجة والمتحكمات", labelEn: "Embedded Systems" },
  { value: "electronics", labelAr: "الهندسة الإلكترونية ودوائر PCB", labelEn: "Electronics & PCB" },
  { value: "iot", labelAr: "إنترنت الأشياء (IoT)", labelEn: "Internet of Things (IoT)" },
  { value: "ai_ml", labelAr: "الذكاء الاصطناعي وتعلم الآلة", labelEn: "AI & Machine Learning" },
  { value: "computer_vision", labelAr: "الرؤية الحاسوبية ومعالجة الصور", labelEn: "Computer Vision" },
  { value: "automation", labelAr: "الأتمتة الصناعية وخطوط الإنتاج", labelEn: "Industrial Automation" },
  { value: "web_app", labelAr: "تطبيقات الويب ولوحات التحكم", labelEn: "Web Applications" },
  { value: "mobile_app", labelAr: "تطبيقات الهواتف الذكية", labelEn: "Mobile Applications" },
  { value: "data_science", labelAr: "علوم وتحليل البيانات الهندسية", labelEn: "Data Science & Analytics" },
  { value: "mechanical", labelAr: "التصميم الميكانيكي والطباعة 3D", labelEn: "Mechanical & 3D Printing" },
  { value: "electrical", labelAr: "القوى الكهربية وأنظمة الطاقة", labelEn: "Electrical & Energy Systems" },
  { value: "other", labelAr: "مشروع متعدد التخصصات / فكرة أخرى", labelEn: "Other / Multidisciplinary" },
];

export const projectStages = [
  { value: "idea", labelAr: "مجرد فكرة على الورق", labelEn: "Idea Only (Concept)" },
  { value: "planning", labelAr: "مرحلة التخطيط والدراسة الفنية", labelEn: "Planning & Architecture" },
  { value: "design", labelAr: "مرحلة التصميم ورسم المخططات", labelEn: "Design & Schematics" },
  { value: "partially_implemented", labelAr: "منفذ جزئياً ويحتاج استكمالاً", labelEn: "Partially Implemented" },
  { value: "prototype_exists", labelAr: "يوجد نموذج أولي يحتاج تحسينات", labelEn: "Existing Prototype" },
  { value: "troubleshooting", labelAr: "متوقف بسبب أعطال فنية مستعصية", labelEn: "Needs Debugging / Troubleshooting" },
  { value: "manufacturing", labelAr: "التصميم جاهز ويحتاج تصنيعاً وتجميعاً", labelEn: "Ready for Manufacturing & Assembly" },
];

export const userTypes = [
  { value: "student", labelAr: "طالب جامعي (مشروع تخرج / تدريب)", labelEn: "University Student (Graduation)" },
  { value: "researcher", labelAr: "باحث أكاديمي / دراسات عليا", labelEn: "Academic Researcher / Postgraduate" },
  { value: "startup", labelAr: "مؤسس شركة ناشئة / رائد أعمال", labelEn: "Startup Founder / Entrepreneur" },
  { value: "company", labelAr: "شركة أو مصنع أو جهة عمل", labelEn: "Enterprise / Company" },
  { value: "individual", labelAr: "مبتكر أو هاوٍ تقني مستقل", labelEn: "Independent Inventor / Maker" },
];

export const requestStatuses = [
  { value: "new", labelAr: "طلب جديد", labelEn: "New Request", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "under_review", labelAr: "قيد المراجعة الهندسية", labelEn: "Under Review", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "info_required", labelAr: "مطلوب بيانات إضافية", labelEn: "Information Required", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "quotation_sent", labelAr: "تم إرسال عرض السعر", labelEn: "Quotation Sent", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "awaiting_approval", labelAr: "في انتظار اعتماد العميل", labelEn: "Awaiting Approval", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  { value: "in_progress", labelAr: "قيد التطوير والتنفيذ", labelEn: "In Progress", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "testing", labelAr: "مرحلة الفحص والاختبار", labelEn: "Testing & Validation", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  { value: "completed", labelAr: "مكتمل ومُسلّم", labelEn: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "cancelled", labelAr: "ملغي", labelEn: "Cancelled", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
];
