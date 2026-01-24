<?php
/**
 * WebData Configuration - Replicating data.ts
 */
$webData = [
    'processes' => [
        'aadhar' => [
            'name' => "Aadhaar",
            'description' => "India’s biometric-based unique digital identity issued by UIDAI.",
            'locations' => ["Noida", "Ajmer", "Hyderabad", "Jamshedpur"],
            'headings' => [
                'hero_subtitle' => "A trusted digital identity for every resident of India.",
                'footer_text' => "UIDAI | Unique Identification Authority of India"
            ],
            'images' => [
                'logo' => "https://upload.wikimedia.org/wikipedia/commons/f/f7/Aadhaar_Logo.svg",
                'hero_bg' => "https://images.unsplash.com/photo-1557804506-669a67965ba0"
            ],
            'links' => [
                'website' => "https://uidai.gov.in/"
            ]
        ],
        'bsnl' => [
            'name' => "BSNL",
            'description' => "Government of India enterprise delivering telecom and broadband services.",
            'locations' => ["Zahirabad", "Mehabubnagar", "Pan India"],
            'headings' => [
                'hero_subtitle' => "Connecting India through digital communication.",
                'footer_text' => "BSNL | Government of India"
            ],
            'images' => [
                'logo' => "/Bsnl/bsnl-logo.png",
                'hero_bg' => "/Bsnl/bsnl-hero-bg.jpg"
            ],
            'links' => [
                'website' => "https://www.bsnl.co.in/"
            ]
        ],
        'bsnlKyc' => [
            'name' => "BSNL KYC",
            'description' => "Digital Aadhaar-based verification for BSNL connections.",
            'locations' => ["Ashok Nagar"],
            'headings' => [
                'hero_subtitle' => "Fast and secure BSNL verification.",
                'footer_text' => "Official BSNL KYC Portal"
            ],
            'images' => [
                'logo' => "/Bsnl/bsnl-logo.png",
                'hero_bg' => "/Bsnl/bsnl-hero-bg.jpg"
            ],
            'links' => [
                'website' => "https://portal2.bsnl.in/myportal/"
            ]
        ],
        'cmConnect' => [
            'name' => "CM Connect (MP)",
            'description' => "A citizen grievance redressal and feedback platform of the Madhya Pradesh Government.",
            'locations' => ["Madhya Pradesh"],
            'headings' => [
                'hero_subtitle' => "Bridging citizens and governance through digital engagement.",
                'footer_text' => "Government of Madhya Pradesh Initiative"
            ],
            'images' => [
                'logo' => "https://upload.wikimedia.org/wikipedia/commons/3/3f/Emblem_of_Madhya_Pradesh.svg",
                'hero_bg' => "https://images.unsplash.com/photo-1562774053-701939374585"
            ],
            'links' => [
                'website' => "https://cmhelpline.mp.gov.in/"
            ]
        ],
        'elderLine' => [
            'name' => "ElderLine",
            'description' => "A national helpline dedicated to serving senior citizens, providing technical, financial, legal guidance, and emotional support.",
            'locations' => ["National"],
            'headings' => [
                'hero_subtitle' => "Empowering the elderly with dignity through compassionate support.",
                'footer_text' => "Toll Free Number: 14567 | Ministry of Social Justice & Empowerment"
            ],
            'images' => [
                'logo' => "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
                'hero_bg' => "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4"
            ],
            'links' => [
                'website' => "https://elder-person.vercel.app/"
            ]
        ],
        'gst' => [
            'name' => "GST",
            'description' => "Unified indirect tax system of India.",
            'locations' => ["Noida", "Bengaluru"],
            'headings' => [
                'hero_subtitle' => "Simplifying tax compliance.",
                'footer_text' => "GST Network | Government of India"
            ],
            'images' => [
                'logo' => "/GST/GST-logo.png",
                'hero_bg' => "https://images.unsplash.com/photo-1554224154-22dec7ec8818"
            ],
            'links' => [
                'website' => "https://www.gst.gov.in/"
            ]
        ],
        'gstat' => [
            'name' => "GSTAT",
            'description' => "The Goods and Services Tax Appellate Tribunal adjudicates disputes arising under the GST law.",
            'locations' => ["Noida", "Principal Bench Delhi"],
            'headings' => [
                'hero_subtitle' => "Ensuring justice, transparency, and fairness in GST dispute resolution.",
                'footer_text' => "GST Appellate Tribunal | Government of India"
            ],
            'images' => [
                'logo' => "/GSTAT/Gstat-logo.png",
                'hero_bg' => "https://images.unsplash.com/photo-1521791055366-0d553872125f"
            ],
            'links' => [
                'website' => "https://gstat.gov.in/"
            ]
        ],
        'moh' => [
            'name' => "MoH",
            'description' => "Ministry of Health and Family Welfare governs healthcare policy and delivery in India.",
            'locations' => ["New Delhi", "Noida Sector-63"],
            'headings' => [
                'hero_subtitle' => "Strengthening India’s healthcare ecosystem.",
                'footer_text' => "MoHFW | Government of India"
            ],
            'images' => [
                'logo' => "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
                'hero_bg' => "https://images.unsplash.com/photo-1580281658629-44c0a1f8a8b1"
            ],
            'links' => [
                'website' => "https://main.mohfw.gov.in/"
            ]
        ],
        'recl' => [
            'name' => "RECL",
            'description' => "Maharatna CPSE financing power and infrastructure projects.",
            'locations' => ["Noida", "Ajmer"],
            'headings' => [
                'hero_subtitle' => "Sustainable energy financing.",
                'footer_text' => "REC Limited | Ministry of Power"
            ],
            'images' => [
                'logo' => "/RECL/RECL-logo.png",
                'hero_bg' => "/RECL/banner.jpeg"
            ],
            'links' => [
                'website' => "https://www.recindia.nic.in/"
            ]
        ],
        'visionPlus' => [
            'name' => "Vision Plus",
            'description' => "Leading digital transformation partner providing cutting-edge IT solutions, cloud services, and enterprise software for government and private sectors.",
            'locations' => ["Ahmedabad", "Gandhinagar", "Mumbai", "New Delhi", "Dubai"],
            'headings' => [
                'hero_subtitle' => "Vision Plus – Your Trusted Partner in Technology and Innovation.",
                'footer_text' => "Vision Plus © 2026 – Excellence in Digital Transformation"
            ],
            'images' => [
                'logo' => "/logo/Vision.png",
                'hero_bg' => "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            ],
            'links' => [
                'website' => "https://visionplusglobal.in/"
            ]
        ]
    ]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Portfolio - Vision Plus</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900">

<section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Our Portfolio
            </h2>
            <div class="w-24 h-2 bg-red-600 mx-auto rounded-full mb-8"></div>
            <p class="text-slate-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Explore our diverse range of digital transformation initiatives and government empowerment programs.
            </p>
        </div>

        <!-- Portfolio Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php foreach ($webData['processes'] as $key => $item): ?>
                <div class="group bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full transform hover:-translate-y-2">
                    
                    <!-- Image Container -->
                    <div class="relative h-64 w-full overflow-hidden">
                        <img 
                            src="<?php echo htmlspecialchars($item['images']['hero_bg'] ?? 'https://images.unsplash.com/photo-1557804506-669a67965ba0'); ?>" 
                            alt="<?php echo htmlspecialchars($item['name']); ?>" 
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        >
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                        
                        <!-- Logo Badge & Title -->
                        <div class="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                            <div class="relative w-14 h-14 rounded-2xl bg-white p-2.5 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img 
                                    src="<?php echo htmlspecialchars($item['images']['logo'] ?? 'https://www.svgrepo.com/show/508699/placeholder.svg'); ?>" 
                                    alt="<?php echo htmlspecialchars($item['name']); ?> logo" 
                                    class="w-full h-full object-contain"
                                >
                            </div>
                            <h3 class="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">
                                <?php echo htmlspecialchars($item['name']); ?>
                            </h3>
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div class="p-8 flex flex-col flex-grow">
                        <p class="text-slate-600 text-base leading-relaxed mb-8 line-clamp-2 flex-grow font-medium">
                            <?php echo htmlspecialchars($item['description'] ?? $item['headings']['hero_subtitle'] ?? ''); ?>
                        </p>

                        <!-- Locations Section -->
                        <?php if (!empty($item['locations'])): ?>
                            <div class="flex flex-wrap gap-2.5 mb-8">
                                <?php 
                                $displayLocations = array_slice($item['locations'], 0, 3);
                                foreach ($displayLocations as $loc): 
                                ?>
                                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/50">
                                        <i class="fa-solid fa-location-dot text-red-600"></i>
                                        <?php echo htmlspecialchars($loc); ?>
                                    </span>
                                <?php endforeach; ?>
                                
                                <?php if (count($item['locations']) > 3): ?>
                                    <span class="text-xs text-slate-400 font-bold self-center px-2">
                                        +<?php echo count($item['locations']) - 3; ?> more
                                    </span>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <!-- Card Footer -->
                        <div class="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div class="flex flex-col">
                                <span class="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">
                                    Entity
                                </span>
                                <span class="text-xs font-bold text-slate-600">
                                    <?php 
                                        $footerText = $item['headings']['footer_text'] ?? $item['name'];
                                        echo htmlspecialchars(explode('|', $footerText)[0]); 
                                    ?>
                                </span>
                            </div>
                            
                            <?php if (!empty($item['links']['website'])): ?>
                                <a
                                    href="<?php echo htmlspecialchars($item['links']['website']); ?>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold px-6 py-3 rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/30 active:scale-95"
                                >
                                    View Project
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Simple Footer -->
<footer class="py-12 border-t border-slate-200 bg-white">
    <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-slate-500 text-sm font-medium">
            &copy; <?php echo date('Y'); ?> Vision Plus. All rights reserved.
        </p>
    </div>
</footer>

</body>
</html>
