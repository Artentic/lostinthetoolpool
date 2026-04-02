-- Seed data for ClickHouse products table
-- Representative products across major ecosystems and categories
-- Prices based on 2025-2026 street pricing from research

-- =============================================================================
-- DRILL/DRIVERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2801-20', 'Milwaukee M18 Compact Brushless Drill/Driver (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'drilling-driving', 'drill-drivers', 'compact-drill-driver', 'milwaukee-m18-compact-drill-driver', 99.00, 99.00, '{"voltage":18,"max_rpm":1800,"max_torque":"500 in-lbs","chuck":"1/2 inch","brushless":true}', 4.8, 3200, '', '{"homedepot":"","amazon":""}', 'Compact brushless drill/driver delivering 500 in-lbs of torque. The go-to drill for the M18 ecosystem.', ['Brushless motor for longer runtime','1/2" all-metal chuck','Compact 6.9" length','LED light'], 1, 3.4),

('DW-DCD791B', 'DeWalt 20V MAX XR Brushless Compact Drill/Driver (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'drilling-driving', 'drill-drivers', 'compact-drill-driver', 'dewalt-20v-xr-compact-drill-driver', 99.00, 119.00, '{"voltage":20,"max_rpm":2000,"max_torque":"531 in-lbs","chuck":"1/2 inch","brushless":true}', 4.8, 4500, '', '{"amazon":"","homedepot":"","lowes":""}', 'Compact brushless drill/driver with 531 in-lbs of torque. DeWalt''s most popular drill.', ['Brushless motor','High-speed transmission','Compact design','3-mode LED'], 1, 3.5),

('MAK-XFD131', 'Makita 18V LXT Brushless Driver-Drill Kit', 'Makita', 'makita-18v-lxt', 'drilling-driving', 'drill-drivers', 'compact-drill-driver', 'makita-18v-lxt-brushless-drill-kit', 159.00, 179.00, '{"voltage":18,"max_rpm":2000,"max_torque":"487 in-lbs","chuck":"1/2 inch","brushless":true}', 4.7, 2800, '', '{"amazon":"","homedepot":""}', 'Brushless drill/driver kit with battery and charger. Makita quality in a compact package.', ['BL Brushless Motor','Star Protection computer controls','Ergonomic soft grip','Kit includes 3.0Ah battery + charger'], 1, 3.9),

('RY-PSBDD01K', 'Ryobi ONE+ HP Brushless Drill/Driver Kit', 'Ryobi', 'ryobi-one-plus', 'drilling-driving', 'drill-drivers', 'compact-drill-driver', 'ryobi-one-plus-hp-brushless-drill-kit', 79.00, 89.00, '{"voltage":18,"max_rpm":1800,"max_torque":"600 in-lbs","chuck":"1/2 inch","brushless":true}', 4.6, 5100, '', '{"homedepot":""}', 'Best value brushless drill in the ONE+ lineup. 600 in-lbs of torque rivals pro brands.', ['HP brushless motor','600 in-lbs torque','24-position clutch','Kit includes 2.0Ah battery + charger'], 1, 3.0);

-- =============================================================================
-- IMPACT DRIVERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2853-20', 'Milwaukee M18 FUEL 1/4" Hex Impact Driver (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'drilling-driving', 'impact-drivers', 'impact-driver', 'milwaukee-m18-fuel-impact-driver', 149.00, 149.00, '{"voltage":18,"max_rpm":3600,"max_torque":"2000 in-lbs","drive":"1/4 hex","brushless":true}', 4.9, 6200, '', '{"homedepot":"","amazon":""}', 'The king of impact drivers. 2000 in-lbs of torque with 4-mode DRIVE CONTROL.', ['POWERSTATE brushless motor','4-mode DRIVE CONTROL','REDLINK intelligence','Auto-stop mode for precision'], 1, 2.9),

('DW-DCF887B', 'DeWalt 20V MAX XR Brushless 1/4" Impact Driver (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'drilling-driving', 'impact-drivers', 'impact-driver', 'dewalt-20v-xr-impact-driver', 119.00, 139.00, '{"voltage":20,"max_rpm":3250,"max_torque":"1825 in-lbs","drive":"1/4 hex","brushless":true}', 4.8, 7800, '', '{"amazon":"","homedepot":"","lowes":""}', 'Best-selling impact driver in America. 3-speed settings for versatility.', ['Brushless motor','3-speed settings','1825 in-lbs torque','Compact 5.3" front-to-back length'], 1, 2.8),

('RY-PSBID01B', 'Ryobi ONE+ HP Brushless Impact Driver (Tool Only)', 'Ryobi', 'ryobi-one-plus', 'drilling-driving', 'impact-drivers', 'impact-driver', 'ryobi-one-plus-hp-impact-driver', 59.00, 69.00, '{"voltage":18,"max_rpm":3200,"max_torque":"1800 in-lbs","drive":"1/4 hex","brushless":true}', 4.6, 3400, '', '{"homedepot":""}', 'Incredible value at under $60. 1800 in-lbs puts it close to pro-grade.', ['HP brushless motor','1800 in-lbs torque','3-speed selection','Tri-beam LED lights'], 1, 2.4);

-- =============================================================================
-- CIRCULAR SAWS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2732-20', 'Milwaukee M18 FUEL 7-1/4" Circular Saw (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'cutting', 'circular-saws', '7-1/4-circular-saw', 'milwaukee-m18-fuel-circular-saw', 199.00, 199.00, '{"voltage":18,"blade_size":"7-1/4 inch","max_rpm":5800,"bevel_capacity":"53 degrees","brushless":true}', 4.8, 2100, '', '{"homedepot":"","amazon":""}', 'Cordless circular saw that matches corded performance. Cuts 2x faster than competitors.', ['POWERSTATE brushless motor','5800 RPM','2-9/16" depth of cut at 90°','Electric brake'], 1, 7.2),

('DW-DCS570B', 'DeWalt 20V MAX 7-1/4" Brushless Circular Saw (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'cutting', 'circular-saws', '7-1/4-circular-saw', 'dewalt-20v-max-circular-saw', 149.00, 159.00, '{"voltage":20,"blade_size":"7-1/4 inch","max_rpm":5500,"bevel_capacity":"57 degrees","brushless":true}', 4.7, 3500, '', '{"amazon":"","homedepot":"","lowes":""}', 'Reliable cordless circular saw with excellent bevel range. Great all-rounder.', ['Brushless motor','5500 RPM','57° bevel capacity','Includes 24T carbide blade'], 1, 6.9),

('RY-PBLCS300B', 'Ryobi ONE+ HP Brushless 7-1/4" Circular Saw (Tool Only)', 'Ryobi', 'ryobi-one-plus', 'cutting', 'circular-saws', '7-1/4-circular-saw', 'ryobi-one-plus-hp-circular-saw', 119.00, 129.00, '{"voltage":18,"blade_size":"7-1/4 inch","max_rpm":5500,"bevel_capacity":"56 degrees","brushless":true}', 4.5, 1800, '', '{"homedepot":""}', 'Budget-friendly 7-1/4" saw that handles most DIY cutting tasks.', ['HP brushless motor','5500 RPM','LED cutline indicator','Dust blower'], 1, 7.0);

-- =============================================================================
-- MITER SAWS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('DW-DWS779', 'DeWalt 12" Double-Bevel Sliding Compound Miter Saw', 'DeWalt', 'dewalt-20v-max', 'cutting', 'miter-saws', '12-sliding-miter-saw', 'dewalt-12-sliding-miter-saw', 399.00, 449.00, '{"blade_size":"12 inch","max_rpm":3800,"bevel":"double","slide":true,"corded":true,"amps":15}', 4.8, 12500, '', '{"amazon":"","homedepot":"","lowes":""}', 'The best-selling miter saw in America. Handles everything from trim to framing lumber.', ['15-amp motor','Double-bevel','Tall sliding fences','XPS cross-cut positioning system','Cuts 2x16 at 90°'], 0, 56.0),

('MIL-2739-20', 'Milwaukee M18 FUEL 12" Dual Bevel Sliding Compound Miter Saw (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'cutting', 'miter-saws', '12-sliding-miter-saw', 'milwaukee-m18-fuel-12-miter-saw', 599.00, 649.00, '{"voltage":18,"blade_size":"12 inch","max_rpm":4000,"bevel":"dual","slide":true,"brushless":true}', 4.7, 1900, '', '{"homedepot":"","amazon":""}', 'Cordless jobsite miter saw. Go cordless for the ultimate flexibility.', ['POWERSTATE brushless motor','Dual bevel','Digital miter angle display','Shadow cut line indicator'], 1, 52.0);

-- =============================================================================
-- RECIPROCATING SAWS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2821-20', 'Milwaukee M18 FUEL SAWZALL Reciprocating Saw (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'cutting', 'reciprocating-saws', 'reciprocating-saw', 'milwaukee-m18-fuel-sawzall', 179.00, 179.00, '{"voltage":18,"max_spm":3000,"stroke_length":"1-1/8 inch","brushless":true}', 4.8, 2800, '', '{"homedepot":"","amazon":""}', 'The most powerful cordless reciprocating saw. Demolition beast.', ['POWERSTATE brushless motor','3000 SPM','FIXTEC blade clamp','Variable speed trigger'], 1, 7.8),

('DW-DCS382B', 'DeWalt 20V MAX XR Brushless Reciprocating Saw (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'cutting', 'reciprocating-saws', 'reciprocating-saw', 'dewalt-20v-xr-reciprocating-saw', 149.00, 159.00, '{"voltage":20,"max_spm":2900,"stroke_length":"1-1/8 inch","brushless":true}', 4.7, 3100, '', '{"amazon":"","homedepot":"","lowes":""}', 'Powerful cordless recip saw with 4-position blade clamp for flush cutting.', ['Brushless motor','2900 SPM','4-position blade clamp','Tool-free blade change'], 1, 5.6);

-- =============================================================================
-- RANDOM ORBIT SANDERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2648-20', 'Milwaukee M18 5" Random Orbit Sander (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'sanding-finishing', 'random-orbit-sanders', 'random-orbit-sander', 'milwaukee-m18-random-orbit-sander', 129.00, 129.00, '{"voltage":18,"pad_size":"5 inch","opm":12000,"brushless":true,"dust_collection":true}', 4.6, 1200, '', '{"homedepot":"","amazon":""}', 'Cordless sanding freedom. Variable speed from 8,000-12,000 OPM.', ['Variable speed 8K-12K OPM','Hook-and-loop pad','Dust-sealed switch','Dust canister included'], 1, 4.0),

('DW-DCW210B', 'DeWalt 20V MAX XR 5" Random Orbit Sander (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'sanding-finishing', 'random-orbit-sanders', 'random-orbit-sander', 'dewalt-20v-xr-random-orbit-sander', 109.00, 119.00, '{"voltage":20,"pad_size":"5 inch","opm":12000,"brushless":true,"dust_collection":true}', 4.6, 2400, '', '{"amazon":"","homedepot":"","lowes":""}', 'Brushless cordless sander with variable speed and dust collection.', ['Brushless motor','Variable speed dial','Hook-and-loop pad','Dust bag included'], 1, 3.7);

-- =============================================================================
-- OUTDOOR POWER — LAWN MOWERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('EGO-LM2135SP', 'EGO POWER+ 56V 21" Self-Propelled Mower Kit', 'EGO', 'ego-56v', 'outdoor-power', 'lawn-mowers', 'self-propelled-mower', 'ego-56v-21-self-propelled-mower', 549.00, 599.00, '{"voltage":56,"deck_size":"21 inch","self_propelled":true,"battery_ah":7.5,"runtime_min":60}', 4.6, 8900, '', '{"amazon":"","homedepot":"","lowes":"","acmetools":""}', '#1 rated battery lawn mower. Matches gas performance with zero emissions.', ['56V ARC Lithium battery','21" deck','Self-propelled variable speed','60-min runtime with 7.5Ah','Weather-resistant construction'], 1, 72.0),

('RY-RY401170', 'Ryobi 40V HP Brushless 21" Self-Propelled Mower Kit', 'Ryobi', 'ryobi-40v', 'outdoor-power', 'lawn-mowers', 'self-propelled-mower', 'ryobi-40v-hp-self-propelled-mower', 399.00, 449.00, '{"voltage":40,"deck_size":"21 inch","self_propelled":true,"battery_ah":6.0,"runtime_min":50}', 4.4, 5200, '', '{"homedepot":""}', 'Best value battery mower. CrossCut multi-blade system for a clean cut.', ['40V HP brushless motor','CrossCut multi-blade','Self-propelled','7 cutting height adjustments'], 1, 65.0);

-- =============================================================================
-- OUTDOOR POWER — STRING TRIMMERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('EGO-ST1521S', 'EGO POWER+ 56V 15" String Trimmer Kit', 'EGO', 'ego-56v', 'outdoor-power', 'string-trimmers', 'string-trimmer', 'ego-56v-15-string-trimmer', 219.00, 249.00, '{"voltage":56,"cutting_swath":"15 inch","line_feed":"rapid reload","battery_ah":2.5}', 4.6, 6100, '', '{"amazon":"","homedepot":"","lowes":""}', 'Professional-grade string trimmer. POWERLOAD auto line feeding.', ['56V brushless motor','POWERLOAD technology','15" cutting swath','Carbon fiber shaft','Bump feed head'], 1, 11.0),

('MIL-2825-21ST', 'Milwaukee M18 FUEL String Trimmer Kit w/ QUIK-LOK', 'Milwaukee', 'milwaukee-m18', 'outdoor-power', 'string-trimmers', 'string-trimmer', 'milwaukee-m18-fuel-string-trimmer', 249.00, 279.00, '{"voltage":18,"cutting_swath":"16 inch","attachment_system":"quik-lok"}', 4.7, 2200, '', '{"homedepot":"","amazon":""}', 'Attachment-capable trimmer. Add edger, blower, hedge trimmer heads.', ['POWERSTATE brushless motor','QUIK-LOK attachment system','16" cutting swath','Easy line reload','Full variable speed trigger'], 1, 12.5);

-- =============================================================================
-- OUTDOOR POWER — LEAF BLOWERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('EGO-LB6504', 'EGO POWER+ 56V 650 CFM Blower Kit', 'EGO', 'ego-56v', 'outdoor-power', 'leaf-blowers', 'handheld-blower', 'ego-56v-650-cfm-blower', 269.00, 299.00, '{"voltage":56,"cfm":650,"mph":180,"battery_ah":5.0}', 4.7, 4500, '', '{"amazon":"","homedepot":"","lowes":""}', 'Turbine-powered blower. 650 CFM moves leaves like a gas backpack.', ['Turbine fan technology','650 CFM / 180 MPH','Variable speed + turbo boost','Weather-resistant'], 1, 9.7),

('RY-RY404015', 'Ryobi 40V HP Brushless Whisper Series Blower Kit', 'Ryobi', 'ryobi-40v', 'outdoor-power', 'leaf-blowers', 'handheld-blower', 'ryobi-40v-whisper-blower', 179.00, 199.00, '{"voltage":40,"cfm":730,"mph":190,"battery_ah":4.0}', 4.5, 3200, '', '{"homedepot":""}', 'Quietest battery blower on the market. 730 CFM without the noise complaints.', ['Whisper Series quiet technology','730 CFM / 190 MPH','Brushless motor','Cruise control'], 1, 7.5);

-- =============================================================================
-- NAILERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2746-20', 'Milwaukee M18 FUEL 18GA Brad Nailer (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'fastening', 'brad-nailers', 'brad-nailer', 'milwaukee-m18-fuel-brad-nailer', 249.00, 249.00, '{"voltage":18,"gauge":18,"nail_length":"5/8 to 2-1/8 inch","magazine_capacity":110,"brushless":true}', 4.8, 3600, '', '{"homedepot":"","amazon":""}', 'No compressor, no hose. Cordless brad nailer for trim work.', ['No compressor needed','Consistent nail depth','Dry-fire lockout','Tool-free depth adjustment'], 1, 6.2),

('DW-DCN680B', 'DeWalt 20V MAX XR 18GA Brad Nailer (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'fastening', 'brad-nailers', 'brad-nailer', 'dewalt-20v-xr-brad-nailer', 219.00, 249.00, '{"voltage":20,"gauge":18,"nail_length":"5/8 to 2-1/8 inch","magazine_capacity":110,"brushless":true}', 4.7, 4200, '', '{"amazon":"","homedepot":"","lowes":""}', 'Cordless brad nailer. Engine-driven design for reliable firing.', ['Engine-driven design','No compressor needed','Stall release lever','Micro-nose for precision'], 1, 6.0);

-- =============================================================================
-- OSCILLATING MULTI-TOOLS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2836-20', 'Milwaukee M18 FUEL Oscillating Multi-Tool (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'cutting', 'oscillating-multi-tools', 'oscillating-multi-tool', 'milwaukee-m18-fuel-oscillating-multi-tool', 159.00, 159.00, '{"voltage":18,"opm":20000,"brushless":true}', 4.7, 1800, '', '{"homedepot":"","amazon":""}', 'The Swiss Army knife of power tools. Cut, sand, scrape, grout removal — one tool does it all.', ['POWERSTATE brushless motor','20,000 OPM','Universal accessory adapter','Variable speed'], 1, 4.2),

('DW-DCS354B', 'DeWalt 20V MAX XR Brushless Oscillating Multi-Tool (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'cutting', 'oscillating-multi-tools', 'oscillating-multi-tool', 'dewalt-20v-xr-oscillating-multi-tool', 129.00, 139.00, '{"voltage":20,"opm":20000,"brushless":true}', 4.7, 5100, '', '{"amazon":"","homedepot":"","lowes":""}', 'Quick-change accessory system. 3-speed selector for different materials.', ['Brushless motor','Quick-Change accessory system','3-speed selector','Dual-grip variable speed trigger'], 1, 3.6);

-- =============================================================================
-- JIGSAWS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2737B-20', 'Milwaukee M18 FUEL D-Handle Jig Saw (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'cutting', 'jigsaws', 'jigsaw', 'milwaukee-m18-fuel-jigsaw', 199.00, 199.00, '{"voltage":18,"max_spm":3500,"stroke_length":"1 inch","bevel":"45 degrees","brushless":true}', 4.7, 800, '', '{"homedepot":"","amazon":""}', 'Precise curved cuts in wood, metal, and plastic. Orbital action for fast cuts.', ['POWERSTATE brushless motor','5-position orbital action','Tool-free blade change','On-board blade storage'], 1, 5.5),

('DW-DCS334B', 'DeWalt 20V MAX XR Brushless Jig Saw (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'cutting', 'jigsaws', 'jigsaw', 'dewalt-20v-xr-jigsaw', 159.00, 179.00, '{"voltage":20,"max_spm":3200,"stroke_length":"1 inch","bevel":"45 degrees","brushless":true}', 4.7, 2400, '', '{"amazon":"","homedepot":"","lowes":""}', 'Top-handle jigsaw with 4-position orbital action. Great for trim and finish work.', ['Brushless motor','4-position orbital action','All-metal keyless blade clamp','LED light and dust blower'], 1, 5.0);

-- =============================================================================
-- ANGLE GRINDERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2880-20', 'Milwaukee M18 FUEL 4-1/2"/5" Grinder (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'sanding-finishing', 'angle-grinders', 'angle-grinder', 'milwaukee-m18-fuel-grinder', 169.00, 169.00, '{"voltage":18,"disc_size":"4-1/2 to 5 inch","max_rpm":8500,"brushless":true}', 4.8, 2200, '', '{"homedepot":"","amazon":""}', 'Cordless grinder with paddle switch. Cuts metal, grinds welds, polishes surfaces.', ['POWERSTATE brushless motor','8500 RPM','No-lock paddle switch','AUTOSTOP kickback control'], 1, 4.8);

-- =============================================================================
-- ROUTERS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('MIL-2723-20', 'Milwaukee M18 FUEL Compact Router (Tool Only)', 'Milwaukee', 'milwaukee-m18', 'sanding-finishing', 'routers', 'compact-router', 'milwaukee-m18-fuel-compact-router', 149.00, 149.00, '{"voltage":18,"collet":"1/4 inch","max_rpm":31000,"brushless":true}', 4.8, 1500, '', '{"homedepot":"","amazon":""}', 'Cordless trim router for edge profiles, roundovers, and chamfers.', ['POWERSTATE brushless motor','Variable speed 10K-31K RPM','1-1/4" base opening','Sub-base accepts template guides'], 1, 4.5),

('DW-DCW600B', 'DeWalt 20V MAX XR Brushless Compact Router (Tool Only)', 'DeWalt', 'dewalt-20v-max', 'sanding-finishing', 'routers', 'compact-router', 'dewalt-20v-xr-compact-router', 139.00, 149.00, '{"voltage":20,"collet":"1/4 inch","max_rpm":25500,"brushless":true}', 4.8, 3800, '', '{"amazon":"","homedepot":"","lowes":""}', 'Cordless router with dual LEDs and variable speed. Smooth plunge base available.', ['Brushless motor','Variable speed 16K-25.5K RPM','Dual LEDs','Soft-start','D-shaped sub-base'], 1, 3.9);

-- =============================================================================
-- CHAINSAWS
-- =============================================================================
INSERT INTO products (sku, name, brand, ecosystem, category, subcategory, tool_type, slug, price_current, price_msrp, specs, rating, review_count, image_url, affiliate_links, description, features, is_cordless, weight_lbs) VALUES
('EGO-CS1804', 'EGO POWER+ 56V 18" Chain Saw Kit', 'EGO', 'ego-56v', 'outdoor-power', 'chainsaws', 'chainsaw', 'ego-56v-18-chainsaw', 349.00, 379.00, '{"voltage":56,"bar_length":"18 inch","chain_speed":"6800 fpm","battery_ah":5.0}', 4.6, 3200, '', '{"amazon":"","homedepot":"","lowes":""}', 'Serious cordless chainsaw. 18" bar handles most homeowner tree work.', ['56V brushless motor','18" Oregon bar and chain','Tool-free chain tensioning','Auto-oiling system'], 1, 14.4);

-- Seed initial price history from current prices
INSERT INTO price_history (sku, price, retailer, in_stock)
SELECT sku, price_current, 'seed', 1 FROM products;
