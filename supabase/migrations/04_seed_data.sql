-- 04_seed_data.sql
-- Mock Data for Damietta Furniture Marketplace (Showrooms, Craftsmen, Products, Options)

-- Test Profile (Mock Vendor Profile)
INSERT INTO public.profiles (id, role, full_name, phone, avatar_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'vendor', 'الحاج محمود الدسوقي', '01012345678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    ('22222222-2222-2222-2222-222222222222', 'vendor', 'المهندس طارق النجار', '01123456789', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
    ('33333333-3333-3333-3333-333333333333', 'customer', 'أحمد سامي المهدي', '01234567890', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
    ('44444444-4444-4444-4444-444444444444', 'admin', 'إدارة ماركت بليس دمياط', '01000000000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Test Vendors
INSERT INTO public.vendors (id, profile_id, business_name, commercial_registration, workshop_address, city, description, tier, status)
VALUES 
    ('aaaa1111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'مؤسسة الدسوقي للأثاث الكلاسيكي والنيوكلاسيك', '104829', 'شارع عبد الرحمن، حي الشرباصي', 'دمياط', 'تاريخ عريق يمتد لأكثر من 35 عاماً في تصنيع الصالونات وغرف النوم الملكية من خشب الزان الأحمر الروماني المنحوت يدوياً (أويما دمياطي).', 'premium', 'approved'),
    ('bbbb2222-bbbb-2222-bbbb-222222222222', '22222222-2222-2222-2222-222222222222', 'أرو ديزاين للأثاث المودرن والمطابخ', '219482', 'طريق المحور الجديد، المنطقة الصناعية', 'دمياط', 'متخصصون في الأثاث المودرن الذكي، المطابخ الأكريليك والبولار، وغرف الأطفال المدمجة مع تصنيع مخصص بدقة هندسية.', 'verified', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Test Products (Rich Damietta Furniture items)
INSERT INTO public.products (id, vendor_id, title, description, price, category, media_urls, post_type, wood_type, manufacturing_time_days, trending_score, views_count)
VALUES 
    (
        'c0010000-0000-0000-0000-000000000001',
        'aaaa1111-aaaa-1111-aaaa-111111111111',
        'غرفة نوم ملكية "فينيسيا" — أويمـا دمياطي يدوي',
        'غرفة نوم كاملة مصنوعة يدوياً بالكامل من أخشاب الزان الأحمر الطبيعي المعتق. تتكون من: سرير كابوتينيه فخم 180 سم، دولاب جرار 3 ضلف بتقسيم داخلي واسع، تسريحة مذهبة مع إضاءة خفية، و2 كومودينو برجام من الرخام الإسباني الطبيعي. تشطيب شامبين فاخر مقاوم للخدوش.',
        68500.00,
        'غرف نوم',
        ARRAY[
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80'
        ],
        'available',
        'خشب زان أحمر روماني طبيعي 100%',
        25,
        94.5,
        1420
    ),
    (
        'c0020000-0000-0000-0000-000000000002',
        'aaaa1111-aaaa-1111-aaaa-111111111111',
        'صالون نيو كلاسيك "قصر الإليزيه" — قماش جاكار تركي',
        'طقم صالون راقي يجمع بين فخامة النحت الدمياطي الأصيل وراحة الجلسة العصرية. يتكون من كنبة ثلاثية، كنبة ثنائية، 2 فوتيه ملكي، وترابيزة وسطية برخام كرارة إيطالي. إسفنج سوفت ريبوند كثافة 35 عالي المرونة وضمان 10 سنوات.',
        49000.00,
        'صالونات',
        ARRAY[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80'
        ],
        'available',
        'زان أحمر مبخر درجة أولى',
        18,
        88.2,
        980
    ),
    (
        'c0030000-0000-0000-0000-000000000003',
        'bbbb2222-bbbb-2222-bbbb-222222222222',
        'ركنة مودرن حرف L هيدروليك مع شيزلونج استرخاء',
        'ركنة عصرية عملية مقاس 320 × 240 سم مع ميكانيزم تركي متحرك لظهر الركنة ليتحول لسرير واسع. أقمشة كتان تركي وتر بروف معالجة ضد الاتساخ، مع شاحن لاسلكي مدمج في الذراع الخشبي.',
        29500.00,
        'صالونات',
        ARRAY[
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&auto=format&fit=crop&q=80'
        ],
        'available',
        'شاسيه زان أحمر مسيف وميكانيزم معدني',
        12,
        76.0,
        840
    ),
    (
        'c0040000-0000-0000-0000-000000000004',
        'bbbb2222-bbbb-2222-bbbb-222222222222',
        'غرفة سفرة مودرن 8 كراسي مع بوفيه بمرآة ليد',
        'طاولة سفرة خشب طبيعي مع قشرة أرو طبيعية وأرجل معدنية مدهونة إلكتروستاتيك. تشمل 8 كراسي منجدة بقماش بوكليه مريح وبوفيه بطول 220 سم مع وحدات تخزين ذكية ومفصلات سوفت كلوز إيطالية.',
        42000.00,
        'غرف سفرة',
        ARRAY[
            'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80'
        ],
        'available',
        'قشرة أرو طبيعي على شاسيه زان',
        20,
        65.8,
        620
    ),
    (
        'c0050000-0000-0000-0000-000000000005',
        'aaaa1111-aaaa-1111-aaaa-111111111111',
        'مشروع تأثيث فيلا كاملة بالتجمع — بورتفوليو تسليمات',
        'توثيق لتسليم فيلا خاصة شاملة غرف النوم والصالونات والمكتبة الكلاسيكية بالكامل من ورشنا في دمياط. نموذج لمنتجاتنا المخصصة والمصنعة بمقاسات معمارية خاصة.',
        0.00,
        'غرف نوم',
        ARRAY[
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&auto=format&fit=crop&q=80'
        ],
        'portfolio',
        'زان روماني وقشور طبيعية',
        40,
        52.1,
        1890
    )
ON CONFLICT (id) DO NOTHING;

-- Customization Options for Venice Bedroom
INSERT INTO public.product_customization_options (product_id, option_name, values, price_adjustments)
VALUES
    ('c0010000-0000-0000-0000-000000000001', 'لون الدهان', ARRAY['شامبين مذهب', 'أبيض دوكو مطفي', 'أوف وايت عسلي'], ARRAY[0, 0, 1500]),
    ('c0010000-0000-0000-0000-000000000001', 'مقاس السرير', ARRAY['160 × 200 سم', '180 × 200 سم (قياسي)', '200 × 200 سم كينج'], ARRAY[-2000, 0, 3000]),
    ('c0010000-0000-0000-0000-000000000001', 'نوع قماش الكابوتينيه', ARRAY['قطيفة تركي مستورد', 'كتان بريميوم معالج', 'جلد مقلوب'], ARRAY[0, 1000, 1500])
ON CONFLICT DO NOTHING;

-- Sample RFQ Request
INSERT INTO public.rfq_requests (id, customer_id, title, category, specifications, budget_range, status)
VALUES (
    'd0010000-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'مطلوب تصنيع صالون كلاسيك مخصص مقاسات خاصة لصالون 6×4 متر',
    'صالونات',
    'نبحث عن ورشة بدمياط لتنفيذ صالون كلاسيك (كنبة 4 مقاعد + 2 فوتيه عريض + ترابيزة رخام هندي أخضر). الخشب المطلوب زان أحمر ثقيل، ونوع القماش جاكار دمشقي ذهبي مائل للبيج.',
    '40,000 - 55,000 جنيه',
    'open'
) ON CONFLICT (id) DO NOTHING;
