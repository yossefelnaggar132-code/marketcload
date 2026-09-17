import { Product, Vendor, RFQRequest, RFQOffer, Order, Dispute } from '@/types';

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    profile_id: 'p1',
    business_name: 'مؤسسة الدسوقي للأثاث الكلاسيكي والنيوكلاسيك',
    commercial_registration: '104829',
    workshop_address: 'شارع عبد الرحمن، حي الشرباصي',
    city: 'دمياط',
    description: 'تاريخ عريق يمتد لأكثر من 35 عاماً في تصنيع الصالونات وغرف النوم الملكية من خشب الزان الأحمر الروماني المنحوت يدوياً (أويما دمياطي).',
    logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'premium',
    status: 'approved',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'v2',
    profile_id: 'p2',
    business_name: 'أرو ديزاين للأثاث المودرن والمطابخ',
    commercial_registration: '219482',
    workshop_address: 'طريق المحور الجديد، المنطقة الصناعية',
    city: 'دمياط',
    description: 'متخصصون في الأثاث المودرن الذكي، المطابخ الأكريليك والبولار، وغرف الأطفال المدمجة مع تصنيع مخصص بدقة هندسية.',
    logo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'verified',
    status: 'approved',
    created_at: '2025-02-15T12:00:00Z',
  },
  {
    id: 'v3',
    profile_id: 'p3',
    business_name: 'ورشة الفنار لصناعة الصالونات والركنات',
    commercial_registration: '381920',
    workshop_address: 'السيالة، دمياط',
    city: 'دمياط',
    description: 'صناعة يدوية مباشرة من الورشة بسعر الجملة. نستخدم أفضل أنواع الإسفنج عالي الكثافة والأقمشة المستوردة.',
    tier: 'basic',
    status: 'pending', // Testing pending vendor approval in admin panel!
    created_at: '2026-03-01T09:00:00Z',
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    vendor_id: 'v1',
    vendor: MOCK_VENDORS[0],
    title: 'غرفة نوم ملكية "فينيسيا" — أويمـا دمياطي يدوي',
    description: 'غرفة نوم كاملة مصنوعة يدوياً بالكامل من أخشاب الزان الأحمر الطبيعي المعتق. تتكون من: سرير كابوتينيه فخم 180 سم، دولاب جرار 3 ضلف بتقسيم داخلي واسع، تسريحة مذهبة مع إضاءة خفية، و2 كومودينو برجام من الرخام الإسباني الطبيعي.',
    price: 68500,
    category: 'غرف نوم',
    media_urls: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=900&auto=format&fit=crop&q=80'
    ],
    post_type: 'available',
    wood_type: 'خشب زان أحمر روماني طبيعي 100%',
    manufacturing_time_days: 25,
    trending_score: 98.4,
    views_count: 1420,
    likes_count: 312,
    saves_count: 85,
    is_liked: false,
    is_saved: false,
    customization_options: [
      {
        id: 'opt-1',
        product_id: 'prod-1',
        option_name: 'لون الدهان',
        values: ['شامبين مذهب ملكي', 'أبيض دوكو مطفي', 'أوف وايت عسلي'],
        price_adjustments: [0, 0, 1500]
      },
      {
        id: 'opt-2',
        product_id: 'prod-1',
        option_name: 'مقاس السرير',
        values: ['160 × 200 سم', '180 × 200 سم (قياسي)', '200 × 200 سم كينج'],
        price_adjustments: [-2000, 0, 3000]
      },
      {
        id: 'opt-3',
        product_id: 'prod-1',
        option_name: 'قماش الكابوتينيه',
        values: ['قطيفة تركي مستورد', 'كتان بريميوم معالج', 'جلد مقلوب'],
        price_adjustments: [0, 1000, 1500]
      }
    ],
    created_at: '2026-03-10T14:30:00Z',
  },
  {
    id: 'prod-2',
    vendor_id: 'v1',
    vendor: MOCK_VENDORS[0],
    title: 'صالون نيو كلاسيك "قصر الإليزيه" — قماش جاكار دمشقي',
    description: 'طقم صالون راقي يجمع بين فخامة النحت الدمياطي الأصيل وراحة الجلسة العصرية. يتكون من كنبة ثلاثية، كنبة ثنائية، 2 فوتيه ملكي، وترابيزة وسطية برخام كرارة إيطالي. إسفنج سوفت ريبوند كثافة 35 عالي المرونة وضمان 10 سنوات.',
    price: 49000,
    category: 'صالونات',
    media_urls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80'
    ],
    post_type: 'available',
    wood_type: 'زان أحمر مبخر درجة أولى',
    manufacturing_time_days: 18,
    trending_score: 91.2,
    views_count: 980,
    likes_count: 245,
    saves_count: 64,
    is_liked: true,
    is_saved: false,
    customization_options: [
      {
        id: 'opt-4',
        product_id: 'prod-2',
        option_name: 'لون الخشب والورق',
        values: ['ورق ذهب عيار 24 مطفي', 'سيلفر فضي شامبين', 'بني جوزي استر طبيعي'],
        price_adjustments: [0, 0, -1500]
      }
    ],
    created_at: '2026-03-12T11:00:00Z',
  },
  {
    id: 'prod-3',
    vendor_id: 'v2',
    vendor: MOCK_VENDORS[1],
    title: 'ركنة مودرن حرف L هيدروليك مع شيزلونج استرخاء ومخارج USB',
    description: 'ركنة عصرية عملية مقاس 320 × 240 سم مع ميكانيزم تركي متحرك لظهر الركنة ليتحول لسرير واسع. أقمشة كتان تركي وتر بروف معالجة ضد الاتساخ، مع شاحن لاسلكي مدمج في الذراع الخشبي.',
    price: 29500,
    category: 'صالونات',
    media_urls: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&auto=format&fit=crop&q=80'
    ],
    post_type: 'available',
    wood_type: 'شاسيه زان أحمر مسيف وميكانيزم معدني',
    manufacturing_time_days: 12,
    trending_score: 83.5,
    views_count: 840,
    likes_count: 189,
    saves_count: 42,
    is_liked: false,
    is_saved: true,
    created_at: '2026-03-08T09:15:00Z',
  },
  {
    id: 'prod-4',
    vendor_id: 'v2',
    vendor: MOCK_VENDORS[1],
    title: 'غرفة سفرة مودرن 8 كراسي مع بوفيه بمرآة ليد ذكية',
    description: 'طاولة سفرة خشب طبيعي مع قشرة أرو طبيعية وأرجل معدنية مدهونة إلكتروستاتيك. تشمل 8 كراسي منجدة بقماش بوكليه مريح وبوفيه بطول 220 سم مع وحدات تخزين ذكية ومفصلات سوفت كلوز إيطالية.',
    price: 42000,
    category: 'غرف سفرة',
    media_urls: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80'
    ],
    post_type: 'available',
    wood_type: 'قشرة أرو طبيعي على شاسيه زان',
    manufacturing_time_days: 20,
    trending_score: 72.0,
    views_count: 620,
    likes_count: 140,
    saves_count: 38,
    is_liked: false,
    is_saved: false,
    created_at: '2026-03-05T16:00:00Z',
  },
  {
    id: 'prod-5',
    vendor_id: 'v1',
    vendor: MOCK_VENDORS[0],
    title: 'مشروع تأثيث فيلا كاملة بالتجمع الخامس — تسليم مارس 2026',
    description: 'توثيق لتسليم فيلا خاصة شاملة غرف النوم والصالونات والمكتبة الكلاسيكية بالكامل من ورشنا في دمياط. نموذج لمنتجاتنا المخصصة والمصنعة بمقاسات معمارية خاصة.',
    price: 0,
    category: 'غرف نوم',
    media_urls: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&auto=format&fit=crop&q=80'
    ],
    post_type: 'portfolio', // Showcases Portfolio distinction!
    wood_type: 'زان روماني وقشور طبيعية',
    manufacturing_time_days: 40,
    trending_score: 64.2,
    views_count: 1890,
    likes_count: 420,
    saves_count: 115,
    is_liked: false,
    is_saved: false,
    created_at: '2026-03-02T18:00:00Z',
  }
];

export const MOCK_RFQS: (RFQRequest & { offers?: RFQOffer[] })[] = [
  {
    id: 'rfq-101',
    customer_id: 'cust-1',
    customer_name: 'أحمد سامي المهدي',
    title: 'مطلوب تصنيع صالون كلاسيك مخصص مقاسات خاصة لصالون 6×4 متر',
    category: 'صالونات',
    specifications: 'نبحث عن ورشة بدمياط لتنفيذ صالون كلاسيك (كنبة 4 مقاعد + 2 فوتيه عريض + ترابيزة رخام هندي أخضر). الخشب المطلوب زان أحمر ثقيل، ونوع القماش جاكار دمشقي ذهبي مائل للبيج.',
    budget_range: '40,000 - 55,000 جنيه',
    sample_images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80'
    ],
    status: 'open',
    offers_count: 2,
    created_at: '2026-03-14T10:00:00Z',
    offers: [
      {
        id: 'offer-1',
        rfq_id: 'rfq-101',
        vendor_id: 'v1',
        vendor: MOCK_VENDORS[0],
        price: 48500,
        notes: 'جاهزون لتنفيذ المقاس المخصص تماماً بالخشب الزان الروماني المشرح وتوريد عينات الأقمشة لاختيارها قبل التنجيد. يشمل الشحن وتركيب داخل القاهرة.',
        delivery_days: 22,
        materials_used: 'زان أحمر مجفف + إسفنج كثافة 35 + رخام هندي أصلي',
        status: 'pending',
        created_at: '2026-03-14T15:30:00Z',
      },
      {
        id: 'offer-2',
        rfq_id: 'rfq-101',
        vendor_id: 'v2',
        vendor: MOCK_VENDORS[1],
        price: 43000,
        notes: 'عرض منافس بجودة ممتازة وضمان 5 سنوات على الهيكل الخشبي.',
        delivery_days: 18,
        materials_used: 'زان أحمر + قماش مستورد معالج ضد البقع',
        status: 'pending',
        created_at: '2026-03-15T09:00:00Z',
      }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-8042',
    customer_id: 'cust-1',
    customer_name: 'أحمد سامي المهدي',
    customer_phone: '01012345678',
    vendor_id: 'v1',
    vendor_name: 'مؤسسة الدسوقي للأثاث الكلاسيكي والنيوكلاسيك',
    product_id: 'prod-1',
    product: MOCK_PRODUCTS[0],
    order_type: 'direct',
    selected_options: {
      'لون الدهان': 'شامبين مذهب ملكي',
      'مقاس السرير': '180 × 200 سم (قياسي)',
      'قماش الكابوتينيه': 'قطيفة تركي مستورد'
    },
    quantity: 1,
    total_price: 68500,
    platform_fee: 2055, // 3% commission
    payment_method: 'online',
    payment_status: 'paid',
    status: 'delivered_pending_confirm', // Ready for 72h confirmation test!
    shipping_address: 'فيلا 14، الحي الأول، التجمع الخامس، القاهرة الجديدة',
    notes: 'يرجى التنسيق مع العميل قبل الشحن بيوم وتوفير فني تركيب دمياطي متمرس.',
    created_at: '2026-03-10T11:20:00Z',
    auto_confirm_deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
  }
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp-01',
    order_id: 'ord-7901',
    customer_id: 'cust-2',
    customer_name: 'سارة عبد الفتاح',
    vendor_id: 'v2',
    vendor_name: 'أرو ديزاين للأثاث المودرن والمطابخ',
    reason: 'اختلاف درجة لون قماش الكراسي عن العينة المعتمدة ووجود خدش في زاوية البوفيه أثناء الشحن.',
    evidence_urls: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=80'
    ],
    status: 'under_review',
    created_at: '2026-03-13T14:00:00Z',
  }
];
