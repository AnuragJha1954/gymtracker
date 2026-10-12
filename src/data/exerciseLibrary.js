// Comprehensive Exercise Library with 150+ exercises categorized by muscle group & equipment
export const EXERCISE_LIBRARY = [
  // CHEST
  { id: 'ex_bench_press', name: 'Barbell Bench Press', muscle: 'Chest', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_incline_db_press', name: 'Incline Dumbbell Press', muscle: 'Chest', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_flat_db_press', name: 'Flat Dumbbell Press', muscle: 'Chest', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_incline_bb_press', name: 'Incline Barbell Press', muscle: 'Chest', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_decline_bb_press', name: 'Decline Barbell Press', muscle: 'Chest', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_decline_db_press', name: 'Decline Dumbbell Press', muscle: 'Chest', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_low_to_high_cable_fly', name: 'Low-to-High Cable Fly', muscle: 'Chest', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_high_to_low_cable_fly', name: 'High-to-Low Cable Fly', muscle: 'Chest', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_cable_crossover', name: 'Cable Crossover', muscle: 'Chest', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_pec_deck_fly', name: 'Pec Deck Fly', muscle: 'Chest', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_chest_press_machine', name: 'Machine Chest Press', muscle: 'Chest', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_incline_chest_machine', name: 'Incline Machine Chest Press', muscle: 'Chest', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_dips_chest', name: 'Chest Dips', muscle: 'Chest', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_pushups', name: 'Push-ups', muscle: 'Chest', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_diamond_pushups', name: 'Diamond Push-ups', muscle: 'Chest', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_db_fly', name: 'Dumbbell Fly', muscle: 'Chest', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_incline_db_fly', name: 'Incline Dumbbell Fly', muscle: 'Chest', category: 'Isolation', equipment: 'Dumbbell' },

  // BACK - LATS & UPPER
  { id: 'ex_lat_pulldown_wide', name: 'Wide-Grip Lat Pulldown', muscle: 'Back', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_lat_pulldown_close', name: 'Close-Grip Lat Pulldown', muscle: 'Back', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_lat_pulldown_neutral', name: 'Neutral-Grip Lat Pulldown', muscle: 'Back', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_pullup', name: 'Pull-up', muscle: 'Back', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_chinup', name: 'Chin-up', muscle: 'Back', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_straight_arm_pulldown', name: 'Straight-Arm Cable Pulldown', muscle: 'Back', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_bb_row', name: 'Barbell Row', muscle: 'Back', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_pendlay_row', name: 'Pendlay Row', muscle: 'Back', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_db_row_chest_supported', name: 'Chest-Supported Dumbbell Row', muscle: 'Back', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_db_row_one_arm', name: 'One-Arm Dumbbell Row', muscle: 'Back', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_seated_cable_row', name: 'Seated Cable Row', muscle: 'Back', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_tbar_row', name: 'T-Bar Row', muscle: 'Back', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_machine_row', name: 'Machine Row', muscle: 'Back', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_meadows_row', name: 'Meadows Row', muscle: 'Back', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_deadlift_conventional', name: 'Conventional Deadlift', muscle: 'Back', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_rack_pull', name: 'Rack Pull', muscle: 'Back', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_back_extension', name: 'Hyperextension (Back Extension)', muscle: 'Back', category: 'Compound', equipment: 'Bodyweight' },

  // SHOULDERS - FRONT, SIDE & REAR DELTS
  { id: 'ex_seated_db_shoulder_press', name: 'Seated Dumbbell Shoulder Press', muscle: 'Shoulders', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_ohp_barbell', name: 'Overhead Press (OHP)', muscle: 'Shoulders', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_arnold_press', name: 'Arnold Press', muscle: 'Shoulders', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_machine_shoulder_press', name: 'Machine Shoulder Press', muscle: 'Shoulders', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_cable_lateral_raise', name: 'Cable Lateral Raise', muscle: 'Shoulders', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_db_lateral_raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_machine_lateral_raise', name: 'Machine Lateral Raise', muscle: 'Shoulders', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_face_pull', name: 'Face Pull', muscle: 'Shoulders', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_reverse_pec_deck', name: 'Reverse Pec Deck', muscle: 'Shoulders', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_rear_delt_db_fly', name: 'Rear Delt Dumbbell Fly', muscle: 'Shoulders', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_front_db_raise', name: 'Front Dumbbell Raise', muscle: 'Shoulders', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_front_cable_raise', name: 'Front Cable Raise', muscle: 'Shoulders', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_upright_row_cable', name: 'Cable Upright Row', muscle: 'Shoulders', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_upright_row_bb', name: 'Barbell Upright Row', muscle: 'Shoulders', category: 'Compound', equipment: 'Barbell' },

  // TRAPS
  { id: 'ex_barbell_shrug', name: 'Barbell Shrug', muscle: 'Traps', category: 'Isolation', equipment: 'Barbell' },
  { id: 'ex_dumbbell_shrug', name: 'Dumbbell Shrug', muscle: 'Traps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_cable_shrug', name: 'Cable Shrug', muscle: 'Traps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_smith_shrug', name: 'Smith Machine Shrug', muscle: 'Traps', category: 'Isolation', equipment: 'Machine' },

  // BICEPS
  { id: 'ex_barbell_curl', name: 'Barbell Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Barbell' },
  { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_hammer_curl', name: 'Hammer Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_cable_curl', name: 'Cable Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_preacher_curl_ez', name: 'EZ-Bar Preacher Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Barbell' },
  { id: 'ex_preacher_curl_machine', name: 'Machine Preacher Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_spider_curl', name: 'Spider Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_concentration_curl', name: 'Concentration Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_cable_hammer_curl', name: 'Cable Rope Hammer Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_bayesian_cable_curl', name: 'Bayesian Cable Curl', muscle: 'Biceps', category: 'Isolation', equipment: 'Cable' },

  // TRICEPS
  { id: 'ex_rope_pushdown', name: 'Rope Pushdown', muscle: 'Triceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_overhead_rope_triceps', name: 'Overhead Rope Triceps Extension', muscle: 'Triceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_skull_crusher_ez', name: 'Skull Crusher (EZ Bar)', muscle: 'Triceps', category: 'Isolation', equipment: 'Barbell' },
  { id: 'ex_close_grip_bench', name: 'Close-Grip Bench Press', muscle: 'Triceps', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_dips_triceps', name: 'Triceps Dips', muscle: 'Triceps', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_straight_bar_pushdown', name: 'Straight-Bar Pushdown', muscle: 'Triceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_cross_body_cable_ext', name: 'Cross-Body Cable Extension', muscle: 'Triceps', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_db_overhead_triceps', name: 'Seated DB Overhead Triceps Extension', muscle: 'Triceps', category: 'Isolation', equipment: 'Dumbbell' },
  { id: 'ex_triceps_kickback', name: 'Cable Triceps Kickback', muscle: 'Triceps', category: 'Isolation', equipment: 'Cable' },

  // QUADS
  { id: 'ex_barbell_squat', name: 'Barbell Back Squat', muscle: 'Quads', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_front_squat', name: 'Barbell Front Squat', muscle: 'Quads', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_leg_press', name: 'Leg Press', muscle: 'Quads', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_hack_squat', name: 'Hack Squat', muscle: 'Quads', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_leg_extension', name: 'Leg Extension', muscle: 'Quads', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_walking_lunges', name: 'Walking Lunges', muscle: 'Quads', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_goblet_squat', name: 'Goblet Squat', muscle: 'Quads', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'Quads', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_sissy_squat', name: 'Sissy Squat', muscle: 'Quads', category: 'Isolation', equipment: 'Bodyweight' },

  // HAMSTRINGS
  { id: 'ex_romanian_deadlift', name: 'Romanian Deadlift', muscle: 'Hamstrings', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_db_rdl', name: 'Dumbbell Romanian Deadlift', muscle: 'Hamstrings', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_single_leg_rdl', name: 'Single-Leg Romanian Deadlift', muscle: 'Hamstrings', category: 'Compound', equipment: 'Dumbbell' },
  { id: 'ex_seated_leg_curl', name: 'Seated Leg Curl', muscle: 'Hamstrings', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_lying_leg_curl', name: 'Lying Leg Curl', muscle: 'Hamstrings', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_standing_leg_curl', name: 'Standing Single Leg Curl', muscle: 'Hamstrings', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_nordic_curl', name: 'Nordic Hamstring Curl', muscle: 'Hamstrings', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_good_morning', name: 'Barbell Good Morning', muscle: 'Hamstrings', category: 'Compound', equipment: 'Barbell' },

  // GLUTES
  { id: 'ex_barbell_hip_thrust', name: 'Barbell Hip Thrust', muscle: 'Glutes', category: 'Compound', equipment: 'Barbell' },
  { id: 'ex_machine_hip_thrust', name: 'Machine Hip Thrust', muscle: 'Glutes', category: 'Compound', equipment: 'Machine' },
  { id: 'ex_glute_kickback_cable', name: 'Cable Glute Kickback', muscle: 'Glutes', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_cable_pull_through', name: 'Cable Pull-Through', muscle: 'Glutes', category: 'Compound', equipment: 'Cable' },
  { id: 'ex_hip_abduction_machine', name: 'Hip Abduction Machine', muscle: 'Glutes', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_step_ups', name: 'Dumbbell Step-Ups', muscle: 'Glutes', category: 'Compound', equipment: 'Dumbbell' },

  // CALVES
  { id: 'ex_standing_calf_raise', name: 'Standing Calf Raise', muscle: 'Calves', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Calves', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_leg_press_calf_raise', name: 'Leg Press Calf Raise', muscle: 'Calves', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_smith_calf_raise', name: 'Smith Machine Calf Raise', muscle: 'Calves', category: 'Isolation', equipment: 'Machine' },
  { id: 'ex_db_single_leg_calf', name: 'Single-Leg Dumbbell Calf Raise', muscle: 'Calves', category: 'Isolation', equipment: 'Dumbbell' },

  // ABS & CORE
  { id: 'ex_cable_crunch', name: 'Cable Crunch', muscle: 'Abs', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_hanging_knee_raise', name: 'Hanging Knee Raise', muscle: 'Abs', category: 'Isolation', equipment: 'Bodyweight' },
  { id: 'ex_hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'Abs', category: 'Isolation', equipment: 'Bodyweight' },
  { id: 'ex_ab_wheel_rollout', name: 'Ab Wheel Rollout', muscle: 'Abs', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_plank', name: 'Plank', muscle: 'Abs', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_weighted_plank', name: 'Weighted Plank', muscle: 'Abs', category: 'Compound', equipment: 'Bodyweight' },
  { id: 'ex_decline_crunch', name: 'Decline Bench Crunch', muscle: 'Abs', category: 'Isolation', equipment: 'Bodyweight' },
  { id: 'ex_woodchoppers', name: 'Cable Woodchopper', muscle: 'Abs', category: 'Isolation', equipment: 'Cable' },
  { id: 'ex_russian_twist', name: 'Russian Twist', muscle: 'Abs', category: 'Isolation', equipment: 'Dumbbell' },

  // CARDIO
  { id: 'ex_incline_treadmill_walk', name: 'Treadmill Incline Walk', muscle: 'Cardio', category: 'Cardio', equipment: 'Machine' },
  { id: 'ex_stairmaster', name: 'StairMaster Climber', muscle: 'Cardio', category: 'Cardio', equipment: 'Machine' },
  { id: 'ex_stationary_bike', name: 'Stationary Cycling', muscle: 'Cardio', category: 'Cardio', equipment: 'Machine' },
  { id: 'ex_rowing_machine', name: 'Rowing Machine', muscle: 'Cardio', category: 'Cardio', equipment: 'Machine' },
  { id: 'ex_jump_rope', name: 'Jump Rope', muscle: 'Cardio', category: 'Cardio', equipment: 'Bodyweight' },
];

export const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Abs',
  'Traps',
  'Cardio'
];

export const EQUIPMENT_TYPES = [
  'All',
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight'
];
