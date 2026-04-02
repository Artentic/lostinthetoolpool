// Neo4j Schema for Lost in the Tool Pool
// Handles: ecosystem relationships, tool-project mapping, compatibility graph

// =============================================================================
// CONSTRAINTS (unique identifiers)
// =============================================================================
CREATE CONSTRAINT brand_slug IF NOT EXISTS FOR (b:Brand) REQUIRE b.slug IS UNIQUE;
CREATE CONSTRAINT ecosystem_slug IF NOT EXISTS FOR (e:Ecosystem) REQUIRE e.slug IS UNIQUE;
CREATE CONSTRAINT battery_id IF NOT EXISTS FOR (bt:Battery) REQUIRE bt.id IS UNIQUE;
CREATE CONSTRAINT tool_sku IF NOT EXISTS FOR (t:Tool) REQUIRE t.sku IS UNIQUE;
CREATE CONSTRAINT category_slug IF NOT EXISTS FOR (c:Category) REQUIRE c.slug IS UNIQUE;
CREATE CONSTRAINT subcategory_slug IF NOT EXISTS FOR (sc:Subcategory) REQUIRE sc.slug IS UNIQUE;
CREATE CONSTRAINT project_slug IF NOT EXISTS FOR (p:Project) REQUIRE p.slug IS UNIQUE;
CREATE CONSTRAINT retailer_slug IF NOT EXISTS FOR (r:Retailer) REQUIRE r.slug IS UNIQUE;
CREATE CONSTRAINT accessory_id IF NOT EXISTS FOR (a:Accessory) REQUIRE a.id IS UNIQUE;

// =============================================================================
// INDEXES for fast lookups
// =============================================================================
CREATE INDEX tool_brand IF NOT EXISTS FOR (t:Tool) ON (t.brand);
CREATE INDEX tool_ecosystem IF NOT EXISTS FOR (t:Tool) ON (t.ecosystem);
CREATE INDEX tool_category IF NOT EXISTS FOR (t:Tool) ON (t.category);
CREATE INDEX project_difficulty IF NOT EXISTS FOR (p:Project) ON (p.difficulty);

// =============================================================================
// NODE TYPES
// =============================================================================
//
// (:Brand)        — Milwaukee, DeWalt, Makita, Ryobi, etc.
// (:Ecosystem)    — M18, 20V MAX, 18V LXT, ONE+, etc.
// (:Battery)      — Specific battery models (e.g. M18 5.0Ah, M18 HD12.0)
// (:Tool)         — Specific tool products (matches ClickHouse SKUs)
// (:Category)     — Level 1 tool category (Cutting, Drilling, etc.)
// (:Subcategory)  — Level 2 (Circular Saws, Impact Drivers, etc.)
// (:Project)      — DIY projects (Build a Deck, Bathroom Reno, etc.)
// (:Retailer)     — Where to buy (Amazon, Home Depot, Lowe's, etc.)
// (:Accessory)    — Blades, bits, consumables that fit specific tools
//
// =============================================================================
// RELATIONSHIP TYPES
// =============================================================================
//
// (Brand)-[:OWNS]->(Ecosystem)
//   Brand owns/manufactures an ecosystem
//
// (Ecosystem)-[:USES_BATTERY]->(Battery)
//   Which batteries work in this ecosystem
//
// (Battery)-[:COMPATIBLE_WITH]->(Battery)
//   Cross-compatibility (e.g. Bosch AMPShare partners)
//
// (Tool)-[:BELONGS_TO]->(Ecosystem)
//   Tool is part of this battery ecosystem
//
// (Tool)-[:IN_CATEGORY]->(Category)
//   Tool's Level 1 category
//
// (Tool)-[:IN_SUBCATEGORY]->(Subcategory)
//   Tool's Level 2 subcategory
//
// (Category)-[:HAS_SUBCATEGORY]->(Subcategory)
//   Category hierarchy
//
// (Tool)-[:POWERED_BY]->(Battery)
//   Which battery powers this tool
//
// (Tool)-[:REQUIRES]->(Accessory)
//   Tool requires this accessory to function (blade, bit, etc.)
//
// (Tool)-[:COMPATIBLE_ACCESSORY]->(Accessory)
//   Compatible accessories (not required, but works)
//
// (Tool)-[:ALTERNATIVE_TO {reason: "..."}]->(Tool)
//   Cross-ecosystem alternatives (DeWalt circular saw ↔ Milwaukee circular saw)
//
// (Tool)-[:UPGRADE_FROM]->(Tool)
//   Within same ecosystem, pro version of a budget tool
//
// (Project)-[:REQUIRES_TOOL {priority: "essential"|"recommended"|"optional"}]->(Tool)
//   Which tools a project needs
//
// (Project)-[:REQUIRES_CATEGORY {priority: "..."}]->(Subcategory)
//   Project needs "a circular saw" (any brand)
//
// (Project)-[:RELATED_TO]->(Project)
//   Related projects (deck building → fence building)
//
// (Retailer)-[:SELLS]->(Tool)
//   Retailer carries this product
//
// (Retailer)-[:EXCLUSIVE]->(Ecosystem)
//   Exclusive retail relationship (Home Depot → Ryobi, Milwaukee)
//
// (Tool)-[:OFTEN_BOUGHT_WITH]->(Tool)
//   Cross-sell relationship
//

// =============================================================================
// SEED: Core Brands
// =============================================================================
MERGE (milwaukee:Brand {slug: 'milwaukee', name: 'Milwaukee Tool', parent_company: 'TTI Group'})
MERGE (dewalt:Brand {slug: 'dewalt', name: 'DeWalt', parent_company: 'Stanley Black & Decker'})
MERGE (makita:Brand {slug: 'makita', name: 'Makita', parent_company: 'Makita Corporation'})
MERGE (ryobi:Brand {slug: 'ryobi', name: 'Ryobi', parent_company: 'TTI Group'})
MERGE (bosch:Brand {slug: 'bosch', name: 'Bosch Power Tools', parent_company: 'Robert Bosch GmbH'})
MERGE (ridgid:Brand {slug: 'ridgid', name: 'Ridgid', parent_company: 'TTI Group'})
MERGE (metabo:Brand {slug: 'metabo-hpt', name: 'Metabo HPT', parent_company: 'Koki Holdings'})
MERGE (flex:Brand {slug: 'flex', name: 'FLEX', parent_company: 'Chervon'})
MERGE (kobalt:Brand {slug: 'kobalt', name: 'Kobalt', parent_company: "Lowe's (Chervon)"})
MERGE (ego:Brand {slug: 'ego', name: 'EGO', parent_company: 'Chervon'})
MERGE (greenworks:Brand {slug: 'greenworks', name: 'Greenworks', parent_company: 'Globe Tools Group'})
MERGE (husqvarna:Brand {slug: 'husqvarna', name: 'Husqvarna', parent_company: 'Husqvarna Group'})
MERGE (stihl:Brand {slug: 'stihl', name: 'STIHL', parent_company: 'Andreas Stihl AG'});

// =============================================================================
// SEED: Ecosystems
// =============================================================================
MERGE (m18:Ecosystem {slug: 'milwaukee-m18', name: 'Milwaukee M18', voltage: 18, tool_count: 250, target: 'pro'})
MERGE (m12:Ecosystem {slug: 'milwaukee-m12', name: 'Milwaukee M12', voltage: 12, tool_count: 125, target: 'pro'})
MERGE (dw20v:Ecosystem {slug: 'dewalt-20v-max', name: 'DeWalt 20V MAX', voltage: 20, tool_count: 300, target: 'both'})
MERGE (dwfv:Ecosystem {slug: 'dewalt-flexvolt', name: 'DeWalt FLEXVOLT', voltage: 60, tool_count: 30, target: 'pro'})
MERGE (mlxt:Ecosystem {slug: 'makita-18v-lxt', name: 'Makita 18V LXT', voltage: 18, tool_count: 350, target: 'both'})
MERGE (mxgt:Ecosystem {slug: 'makita-40v-xgt', name: 'Makita 40V XGT', voltage: 40, tool_count: 170, target: 'pro'})
MERGE (ry18:Ecosystem {slug: 'ryobi-one-plus', name: 'Ryobi ONE+ 18V', voltage: 18, tool_count: 300, target: 'diy'})
MERGE (ry40:Ecosystem {slug: 'ryobi-40v', name: 'Ryobi 40V HP', voltage: 40, tool_count: 75, target: 'diy'})
MERGE (bosch18:Ecosystem {slug: 'bosch-18v', name: 'Bosch 18V CORE/PROFACTOR', voltage: 18, tool_count: 90, target: 'both'})
MERGE (ridgid18:Ecosystem {slug: 'ridgid-18v', name: 'Ridgid 18V', voltage: 18, tool_count: 85, target: 'both'})
MERGE (metabomv:Ecosystem {slug: 'metabo-hpt-multivolt', name: 'Metabo HPT MultiVolt', voltage: 36, tool_count: 45, target: 'pro'})
MERGE (flex24:Ecosystem {slug: 'flex-24v', name: 'FLEX 24V', voltage: 24, tool_count: 65, target: 'pro'})
MERGE (kobalt24:Ecosystem {slug: 'kobalt-24v', name: 'Kobalt 24V', voltage: 24, tool_count: 75, target: 'diy'})
MERGE (ego56:Ecosystem {slug: 'ego-56v', name: 'EGO 56V Power+', voltage: 56, tool_count: 70, target: 'both'})
MERGE (gw24:Ecosystem {slug: 'greenworks-24v', name: 'Greenworks 24V', voltage: 24, tool_count: 100, target: 'diy'})
MERGE (gw80:Ecosystem {slug: 'greenworks-80v', name: 'Greenworks 80V', voltage: 80, tool_count: 30, target: 'both'})
MERGE (husq:Ecosystem {slug: 'husqvarna-battery', name: 'Husqvarna Battery Series', voltage: 36, tool_count: 55, target: 'pro'})
MERGE (stihlap:Ecosystem {slug: 'stihl-ap', name: 'STIHL AP System', voltage: 36, tool_count: 25, target: 'pro'})
MERGE (stihlak:Ecosystem {slug: 'stihl-ak', name: 'STIHL AK System', voltage: 36, tool_count: 20, target: 'diy'});

// Brand → Ecosystem relationships
MATCH (b:Brand {slug: 'milwaukee'}), (e:Ecosystem) WHERE e.slug IN ['milwaukee-m18', 'milwaukee-m12'] MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'dewalt'}), (e:Ecosystem) WHERE e.slug IN ['dewalt-20v-max', 'dewalt-flexvolt'] MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'makita'}), (e:Ecosystem) WHERE e.slug IN ['makita-18v-lxt', 'makita-40v-xgt'] MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'ryobi'}), (e:Ecosystem) WHERE e.slug IN ['ryobi-one-plus', 'ryobi-40v'] MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'bosch'}), (e:Ecosystem {slug: 'bosch-18v'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'ridgid'}), (e:Ecosystem {slug: 'ridgid-18v'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'metabo-hpt'}), (e:Ecosystem {slug: 'metabo-hpt-multivolt'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'flex'}), (e:Ecosystem {slug: 'flex-24v'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'kobalt'}), (e:Ecosystem {slug: 'kobalt-24v'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'ego'}), (e:Ecosystem {slug: 'ego-56v'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'greenworks'}), (e:Ecosystem) WHERE e.slug IN ['greenworks-24v', 'greenworks-80v'] MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'husqvarna'}), (e:Ecosystem {slug: 'husqvarna-battery'}) MERGE (b)-[:OWNS]->(e);
MATCH (b:Brand {slug: 'stihl'}), (e:Ecosystem) WHERE e.slug IN ['stihl-ap', 'stihl-ak'] MERGE (b)-[:OWNS]->(e);

// =============================================================================
// SEED: Retailers
// =============================================================================
MERGE (amazon:Retailer {slug: 'amazon', name: 'Amazon', commission_rate: 0.03, cookie_days: 1})
MERGE (hd:Retailer {slug: 'homedepot', name: 'Home Depot', commission_rate: 0.01, cookie_days: 1})
MERGE (lowes:Retailer {slug: 'lowes', name: "Lowe's", commission_rate: 0.008, cookie_days: 1})
MERGE (acme:Retailer {slug: 'acmetools', name: 'Acme Tools', commission_rate: 0.03, cookie_days: 30})
MERGE (ohio:Retailer {slug: 'ohiopowertool', name: 'Ohio Power Tool', commission_rate: 0.065, cookie_days: 60})
MERGE (cpo:Retailer {slug: 'cpooutlets', name: 'CPO Outlets', commission_rate: 0.04, cookie_days: 30})
MERGE (kc:Retailer {slug: 'kctool', name: 'KC Tool', commission_rate: 0.10, cookie_days: 30})
MERGE (toolnut:Retailer {slug: 'toolnut', name: 'Tool Nut', commission_rate: 0.03, cookie_days: 45});

// Exclusive retail relationships
MATCH (r:Retailer {slug: 'homedepot'}), (e:Ecosystem) WHERE e.slug IN ['milwaukee-m18', 'milwaukee-m12', 'ryobi-one-plus', 'ryobi-40v', 'ridgid-18v'] MERGE (r)-[:EXCLUSIVE]->(e);
MATCH (r:Retailer {slug: 'lowes'}), (e:Ecosystem {slug: 'kobalt-24v'}) MERGE (r)-[:EXCLUSIVE]->(e);

// =============================================================================
// SEED: Categories & Subcategories
// =============================================================================
MERGE (c_drill:Category {slug: 'drilling-driving', name: 'Drilling & Driving'})
MERGE (c_cut:Category {slug: 'cutting', name: 'Cutting'})
MERGE (c_sand:Category {slug: 'sanding-finishing', name: 'Sanding & Finishing'})
MERGE (c_meas:Category {slug: 'measuring-layout', name: 'Measuring & Layout'})
MERGE (c_fast:Category {slug: 'fastening', name: 'Fastening'})
MERGE (c_demo:Category {slug: 'demolition', name: 'Demolition'})
MERGE (c_plumb:Category {slug: 'plumbing', name: 'Plumbing Tools'})
MERGE (c_elec:Category {slug: 'electrical', name: 'Electrical Tools'})
MERGE (c_conc:Category {slug: 'concrete-masonry', name: 'Concrete & Masonry'})
MERGE (c_outdoor:Category {slug: 'outdoor-power', name: 'Outdoor Power Equipment'})
MERGE (c_paint:Category {slug: 'painting', name: 'Painting & Finishing'})
MERGE (c_clamp:Category {slug: 'clamping', name: 'Clamping & Workholding'})
MERGE (c_safety:Category {slug: 'safety', name: 'Safety Equipment'})
MERGE (c_hand:Category {slug: 'hand-tools', name: 'Hand Tools'})
MERGE (c_wood:Category {slug: 'woodworking', name: 'Woodworking'})
MERGE (c_auto:Category {slug: 'automotive', name: 'Automotive Tools'});

// Subcategories — Drilling & Driving
MATCH (c:Category {slug: 'drilling-driving'})
MERGE (sc:Subcategory {slug: 'drill-drivers', name: 'Drill/Drivers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc)
MERGE (sc2:Subcategory {slug: 'impact-drivers', name: 'Impact Drivers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc2)
MERGE (sc3:Subcategory {slug: 'hammer-drills', name: 'Hammer Drills'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc3)
MERGE (sc4:Subcategory {slug: 'right-angle-drills', name: 'Right Angle Drills'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc4);

// Subcategories — Cutting
MATCH (c:Category {slug: 'cutting'})
MERGE (sc:Subcategory {slug: 'circular-saws', name: 'Circular Saws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc)
MERGE (sc2:Subcategory {slug: 'miter-saws', name: 'Miter Saws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc2)
MERGE (sc3:Subcategory {slug: 'table-saws', name: 'Table Saws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc3)
MERGE (sc4:Subcategory {slug: 'reciprocating-saws', name: 'Reciprocating Saws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc4)
MERGE (sc5:Subcategory {slug: 'jigsaws', name: 'Jigsaws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc5)
MERGE (sc6:Subcategory {slug: 'band-saws', name: 'Band Saws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc6)
MERGE (sc7:Subcategory {slug: 'oscillating-multi-tools', name: 'Oscillating Multi-Tools'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc7);

// Subcategories — Outdoor
MATCH (c:Category {slug: 'outdoor-power'})
MERGE (sc:Subcategory {slug: 'lawn-mowers', name: 'Lawn Mowers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc)
MERGE (sc2:Subcategory {slug: 'string-trimmers', name: 'String Trimmers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc2)
MERGE (sc3:Subcategory {slug: 'leaf-blowers', name: 'Leaf Blowers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc3)
MERGE (sc4:Subcategory {slug: 'chainsaws', name: 'Chainsaws'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc4)
MERGE (sc5:Subcategory {slug: 'hedge-trimmers', name: 'Hedge Trimmers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc5)
MERGE (sc6:Subcategory {slug: 'pressure-washers', name: 'Pressure Washers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc6);

// Subcategories — Fastening
MATCH (c:Category {slug: 'fastening'})
MERGE (sc:Subcategory {slug: 'brad-nailers', name: 'Brad Nailers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc)
MERGE (sc2:Subcategory {slug: 'framing-nailers', name: 'Framing Nailers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc2)
MERGE (sc3:Subcategory {slug: 'finish-nailers', name: 'Finish Nailers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc3)
MERGE (sc4:Subcategory {slug: 'staplers', name: 'Staplers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc4)
MERGE (sc5:Subcategory {slug: 'impact-wrenches', name: 'Impact Wrenches'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc5);

// Subcategories — Sanding
MATCH (c:Category {slug: 'sanding-finishing'})
MERGE (sc:Subcategory {slug: 'random-orbit-sanders', name: 'Random Orbit Sanders'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc)
MERGE (sc2:Subcategory {slug: 'belt-sanders', name: 'Belt Sanders'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc2)
MERGE (sc3:Subcategory {slug: 'detail-sanders', name: 'Detail Sanders'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc3)
MERGE (sc4:Subcategory {slug: 'angle-grinders', name: 'Angle Grinders'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc4)
MERGE (sc5:Subcategory {slug: 'routers', name: 'Routers'}) MERGE (c)-[:HAS_SUBCATEGORY]->(sc5);

// =============================================================================
// SEED: Projects
// =============================================================================
MERGE (:Project {slug: 'build-a-deck', name: 'Build a Deck', difficulty: 3, time_estimate: '3-5 weekends', description: 'Build a wood or composite deck attached to your house'})
MERGE (:Project {slug: 'build-a-fence', name: 'Build a Fence', difficulty: 2, time_estimate: '2-3 weekends', description: 'Install a wood privacy or picket fence'})
MERGE (:Project {slug: 'bathroom-renovation', name: 'Bathroom Renovation', difficulty: 4, time_estimate: '4-8 weekends', description: 'Full bathroom remodel including tile, fixtures, and plumbing'})
MERGE (:Project {slug: 'kitchen-renovation', name: 'Kitchen Renovation', difficulty: 5, time_estimate: '8-16 weekends', description: 'Kitchen remodel including cabinets, countertops, and appliances'})
MERGE (:Project {slug: 'finish-a-basement', name: 'Finish a Basement', difficulty: 4, time_estimate: '8-12 weekends', description: 'Frame, insulate, drywall, and finish a basement space'})
MERGE (:Project {slug: 'install-hardwood-flooring', name: 'Install Hardwood/Laminate Flooring', difficulty: 3, time_estimate: '2-4 weekends', description: 'Install hardwood or laminate flooring in one or more rooms'})
MERGE (:Project {slug: 'install-tile', name: 'Install Tile', difficulty: 3, time_estimate: '2-4 weekends', description: 'Install ceramic or porcelain tile on floors or walls'})
MERGE (:Project {slug: 'build-raised-garden-beds', name: 'Build Raised Garden Beds', difficulty: 1, time_estimate: '1 weekend', description: 'Build simple raised garden beds from lumber'})
MERGE (:Project {slug: 'build-a-shed', name: 'Build a Shed', difficulty: 3, time_estimate: '3-5 weekends', description: 'Build a small to medium storage shed'})
MERGE (:Project {slug: 'drywall-installation', name: 'Drywall Installation & Finishing', difficulty: 3, time_estimate: '2-4 weekends', description: 'Hang, tape, mud, and sand drywall'})
MERGE (:Project {slug: 'paint-a-room', name: 'Paint a Room', difficulty: 1, time_estimate: '1-2 days', description: 'Prep and paint walls and trim in a room'})
MERGE (:Project {slug: 'install-crown-molding', name: 'Install Crown Molding / Trim', difficulty: 3, time_estimate: '1-2 weekends', description: 'Install crown molding, baseboard, or trim'})
MERGE (:Project {slug: 'basic-plumbing-repairs', name: 'Basic Plumbing Repairs', difficulty: 2, time_estimate: '1-4 hours per repair', description: 'Fix leaks, replace faucets, unclog drains'})
MERGE (:Project {slug: 'basic-electrical-work', name: 'Basic Electrical Work', difficulty: 3, time_estimate: '1-4 hours per task', description: 'Replace outlets, switches, light fixtures'})
MERGE (:Project {slug: 'hang-shelves-cabinets', name: 'Hang Shelves / Cabinets', difficulty: 2, time_estimate: '2-4 hours', description: 'Mount shelves or wall cabinets'})
MERGE (:Project {slug: 'assemble-furniture', name: 'Assemble Furniture', difficulty: 1, time_estimate: '1-3 hours per piece', description: 'Assemble flat-pack or kit furniture'})
MERGE (:Project {slug: 'car-maintenance', name: 'Car Maintenance Basics', difficulty: 2, time_estimate: '1-4 hours per task', description: 'Oil changes, brake pads, basic maintenance'})
MERGE (:Project {slug: 'yard-maintenance', name: 'Yard Maintenance', difficulty: 1, time_estimate: '2-4 hours weekly', description: 'Mowing, edging, trimming, leaf blowing'})
MERGE (:Project {slug: 'tree-trimming', name: 'Tree Trimming / Removal', difficulty: 4, time_estimate: '1-2 days', description: 'Trim branches or remove small trees'})
MERGE (:Project {slug: 'concrete-work', name: 'Concrete Work', difficulty: 4, time_estimate: '2-4 weekends', description: 'Pour a small patio or walkway'});

// Project relationships
MATCH (p1:Project {slug: 'build-a-deck'}), (p2:Project {slug: 'build-a-fence'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'bathroom-renovation'}), (p2:Project {slug: 'install-tile'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'bathroom-renovation'}), (p2:Project {slug: 'basic-plumbing-repairs'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'kitchen-renovation'}), (p2:Project {slug: 'install-tile'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'kitchen-renovation'}), (p2:Project {slug: 'basic-plumbing-repairs'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'kitchen-renovation'}), (p2:Project {slug: 'basic-electrical-work'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'finish-a-basement'}), (p2:Project {slug: 'drywall-installation'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'finish-a-basement'}), (p2:Project {slug: 'install-hardwood-flooring'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'drywall-installation'}), (p2:Project {slug: 'paint-a-room'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'yard-maintenance'}), (p2:Project {slug: 'tree-trimming'}) MERGE (p1)-[:RELATED_TO]->(p2);
MATCH (p1:Project {slug: 'build-a-deck'}), (p2:Project {slug: 'concrete-work'}) MERGE (p1)-[:RELATED_TO]->(p2);
