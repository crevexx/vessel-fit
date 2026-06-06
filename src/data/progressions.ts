import { ProgressionTree, Routine } from '../types';

export const PROGRESSION_TREES: ProgressionTree[] = [
  {
    id: 'tree_pull',
    name: 'Pull-up & Vertical Pull Progression',
    category: 'Pull',
    description: 'Master the fundamental vertical pulling path from basic scapular activation to the elite Muscle-up.',
    levels: [
      { id: 'pull_1', level: 1, name: 'Scapular Pulls', category: 'Pull', description: 'Hang from a bar and pull your shoulder blades down and back without bending your arms. Strengthens shoulder stabilizers.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 15 },
      { id: 'pull_2', level: 2, name: 'Inverted Rows (Australian Pull-ups)', category: 'Pull', description: 'Perform horizontal rows from a low bar or rings at waist height. Keep body in a strict plank.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 12 },
      { id: 'pull_3', level: 3, name: 'Negative Pull-ups', category: 'Pull', description: 'Jump or step up to the top of the pull-up position. Lower yourself down as slowly as possible (5-8 seconds).', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 8 },
      { id: 'pull_4', level: 4, name: 'Full Dead-Hang Pull-ups', category: 'Pull', description: 'Standard bodyweight pull-up starting from a complete dead hang and hitting chest-to-bar. No kipping.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 10 },
      { id: 'pull_5', level: 5, name: 'L-Sit Pull-ups', category: 'Pull', description: 'Hold an L-sit position (legs extended forward parallel to ground) while performing strict pull-ups.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 8 },
      { id: 'pull_6', level: 6, name: 'Chest-To-Bar Pull-ups', category: 'Pull', description: 'Pull explosively so that your collarbone or lower chest touches the bar at the peak of the movement.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 8 },
      { id: 'pull_7', level: 7, name: 'The Muscle-up', category: 'Pull', description: 'Explosive pull transition over the bar into a dip. The ultimate calisthenics power skill.', progressionTreeId: 'tree_pull', targetMetric: 'reps', targetValue: 5 },
    ]
  },
  {
    id: 'tree_push',
    name: 'Push-up & Horizontal Push Progression',
    category: 'Push',
    description: 'Build robust chest, shoulders, and triceps power from inclined push-ups up to planche variations.',
    levels: [
      { id: 'push_1', level: 1, name: 'Wall Push-ups', category: 'Push', description: 'Lean against a wall and push away. Extremely helpful for tendon healing and baseline activation.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 20 },
      { id: 'push_2', level: 2, name: 'Incline Push-ups', category: 'Push', description: 'Place hands on a high bench, table, or box. Keep body in a continuous solid line and lower chest to bench.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 15 },
      { id: 'push_3', level: 3, name: 'Knee Push-ups', category: 'Push', description: 'Maintain a straight line from knee to shoulder. Keep elbows tucked in at a 45-degree angle.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 15 },
      { id: 'push_4', level: 4, name: 'Full Flat Push-ups', category: 'Push', description: 'Standard ground push-up with full range of motion. Elbows path close to ribs, core tight, glutes engaged.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 15 },
      { id: 'push_5', level: 5, name: 'Diamond Push-ups', category: 'Push', description: 'Place thumbs and index fingers together under the chest. Targets the triceps heavily.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 12 },
      { id: 'push_6', level: 6, name: 'Archer Push-ups', category: 'Push', description: 'Extend one arm straight to the side while bending the primary pushing arm. Develops single-arm strength.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 10 },
      { id: 'push_7', level: 7, name: 'Pseudo Planche Push-ups', category: 'Push', description: 'Leaning forward significantly so hands are aligned with waist. Extends shoulder loading tremendously.', progressionTreeId: 'tree_push', targetMetric: 'reps', targetValue: 8 },
    ]
  },
  {
    id: 'tree_vpush',
    name: 'Handstand Push-up Progression',
    category: 'Push',
    description: 'Sculpt massive shoulders and improve vertical pressing geometry from pike holds to overhead push-ups.',
    levels: [
      { id: 'vpush_1', level: 1, name: 'Pike Hold', category: 'Push', description: 'Place feet on ground, hands on ground, hips folded 90 deg. Keep arms straight, push shoulders through.', progressionTreeId: 'tree_vpush', targetMetric: 'hold', targetValue: 30 },
      { id: 'vpush_2', level: 2, name: 'Pike Push-ups', category: 'Push', description: 'From a pike position, lower forward to form a tripod with hands/head, then press up and back.', progressionTreeId: 'tree_vpush', targetMetric: 'reps', targetValue: 10 },
      { id: 'vpush_3', level: 3, name: 'Elevated Pike Push-ups', category: 'Push', description: 'Elevate your feet on a box or bench to load more bodyweight (approx. 60-70% total weight) onto the hands.', progressionTreeId: 'tree_vpush', targetMetric: 'reps', targetValue: 8 },
      { id: 'vpush_4', level: 4, name: 'Wall Handstand Hold', category: 'Push', description: 'Kick up or chest-to-wall crawl up to standard static handstand against a wall. Build wrist/shoulder stamina.', progressionTreeId: 'tree_vpush', targetMetric: 'hold', targetValue: 45 },
      { id: 'vpush_5', level: 5, name: 'Handstand Push-up Negatives', category: 'Push', description: 'From wall handstand, lower yourself under complete control until head gently touches the mat (4-6 sec).', progressionTreeId: 'tree_vpush', targetMetric: 'reps', targetValue: 5 },
      { id: 'vpush_6', level: 6, name: 'Wall Handstand Push-ups', category: 'Push', description: 'Start in wall handstand, lower down until head touches ground, and press up to full lockout.', progressionTreeId: 'tree_vpush', targetMetric: 'reps', targetValue: 6 },
      { id: 'vpush_7', level: 7, name: 'Freestanding HS Push-ups', category: 'Push', description: 'The absolute pinnacle of balance and shoulder endurance. Push-up execution with no wall support.', progressionTreeId: 'tree_vpush', targetMetric: 'reps', targetValue: 3 },
    ]
  },
  {
    id: 'tree_core',
    name: 'L-Sit & Front Lever Progression',
    category: 'Core',
    description: 'Build isometric core and lat power to achieve horizontal static holds in mid-air.',
    levels: [
      { id: 'core_1', level: 1, name: 'Hanging Knee Tucks', category: 'Core', description: 'Hang from a bar and raise knees to chest. Strengthens hip flexors and lower abs.', progressionTreeId: 'tree_core', targetMetric: 'reps', targetValue: 15 },
      { id: 'core_2', level: 2, name: 'Tuck L-Sit Hang / Hold', category: 'Core', description: 'Support yourself on parallettes or ground. Tuck knees up and hover butt off the ground.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 20 },
      { id: 'core_3', level: 3, name: 'Full L-Sit Hold (Parallettes)', category: 'Core', description: 'Straight leg support hold. Keep shoulders depressed/active, legs fully extended parallel to ground.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 15 },
      { id: 'core_4', level: 4, name: 'Tuck Front Lever Hold', category: 'Core', description: 'Hang from bar, pull into upside-down flat back angle, but with knees completely tucked in to torso.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 15 },
      { id: 'core_5', level: 5, name: 'Advanced Tuck Front Lever', category: 'Core', description: 'In front lever, move knee placement away from chest so hips are straight, but shins remain bent.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 10 },
      { id: 'core_6', level: 6, name: 'One-Leg Front Lever Hold', category: 'Core', description: 'Keep one leg completely straight and active, and tuck the other leg close to your chest.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 10 },
      { id: 'core_7', level: 7, name: 'Full Front Lever Hold', category: 'Core', description: 'The ultimate showcase of back-to-core leverage. Keep body perfectly horizontal and straight.', progressionTreeId: 'tree_core', targetMetric: 'hold', targetValue: 5 },
    ]
  },
  {
    id: 'tree_legs',
    name: 'Unilateral Leg & squat Progression',
    category: 'Legs',
    description: 'Construct leg stability, range of motion, and quad power from essential squats to the Pistol Squat.',
    levels: [
      { id: 'legs_1', level: 1, name: 'Air Squats', category: 'Legs', description: 'Standard bodyweight squat. Keep chest up, heels driven down, and fold below parallel.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 25 },
      { id: 'legs_2', level: 2, name: 'Assisted Pistol Squats', category: 'Legs', description: 'Pistol squat while holding onto a strap, pole, or doorframe to reduce leg stabilization load.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 10 },
      { id: 'legs_3', level: 3, name: 'Bulgarian Split Squats', category: 'Legs', description: 'Rear foot elevated on a bench or chair. Focuses loaded resistance on the quadriceps of the front foot.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 12 },
      { id: 'legs_4', level: 4, name: 'Airborne Squats', category: 'Legs', description: 'Bend one leg back and lower yourself until that back knee gently touches the floor just behind the heel.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 8 },
      { id: 'legs_5', level: 5, name: 'Shrimp Squats (Foot Held)', category: 'Legs', description: 'Lower yourself in a single-leg squat while actively holding the foot of your non-working leg behind you.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 6 },
      { id: 'legs_6', level: 6, name: 'Full Pistol Squat', category: 'Legs', description: 'Drop into a full depth one-leg squat, non-working leg completely straight forward above turf level.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 8 },
      { id: 'legs_7', level: 7, name: 'Weighted Pistol Squat', category: 'Legs', description: 'Carry a matching kettlebell, dumbbell, or sandbag (+10-20kg) to scale lower body power boundaries.', progressionTreeId: 'tree_legs', targetMetric: 'reps', targetValue: 5 },
    ]
  }
];

export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: 'routine_full_body',
    name: 'Fundamental Full Body Basics',
    category: 'Push',
    description: 'Perfect starting routine targeting all foundational movement vectors to build a rugged muscle base.',
    exercises: [
      { exerciseId: 'pull_4', targetSets: 4, targetRepsOrTime: '8-10 reps' },
      { exerciseId: 'push_4', targetSets: 4, targetRepsOrTime: '12-15 reps' },
      { exerciseId: 'core_2', targetSets: 3, targetRepsOrTime: '15-20s hold' },
      { exerciseId: 'legs_3', targetSets: 3, targetRepsOrTime: '10 reps (each)' },
    ]
  },
  {
    id: 'routine_skill_overload',
    name: 'Skill & static Power Workout',
    category: 'Skills',
    description: 'Intermediate session prioritizing static positions and upper body leverage patterns.',
    exercises: [
      { exerciseId: 'vpush_4', targetSets: 4, targetRepsOrTime: '30-40s hold' },
      { exerciseId: 'core_4', targetSets: 4, targetRepsOrTime: '8-12s hold' },
      { exerciseId: 'pull_5', targetSets: 3, targetRepsOrTime: '5-8 reps' },
      { exerciseId: 'push_6', targetSets: 3, targetRepsOrTime: '8 reps (each)' },
    ]
  },
  {
    id: 'routine_beast_lower',
    name: 'Lower Body & Core Crusher',
    category: 'Legs',
    description: 'Focuses strictly on unilateral leg strength, deep mobility, and core integrity.',
    exercises: [
      { exerciseId: 'legs_6', targetSets: 4, targetRepsOrTime: '5-8 reps' },
      { exerciseId: 'core_3', targetSets: 4, targetRepsOrTime: '10-15s hold' },
      { exerciseId: 'legs_4', targetSets: 3, targetRepsOrTime: '8 reps' },
      { exerciseId: 'core_1', targetSets: 3, targetRepsOrTime: '12-15 reps' },
    ]
  }
];

// Seed workout logs so the dashboard comes with very satisfying pre-loaded data!
export const PRELOADED_LOGS = [
  {
    id: 'log_1',
    date: '2026-05-20',
    routineName: 'Fundamental Full Body Basics',
    durationMinutes: 45,
    notes: 'Feeling strong. Did all reps successfully. First time hitting full pull-up requirements.',
    exercisesLogged: [
      {
        id: 'elog_1',
        exerciseId: 'pull_4',
        exerciseName: 'Full Dead-Hang Pull-ups',
        category: 'Pull' as const,
        sets: [
          { id: 's1', reps: 8, rpe: 8 },
          { id: 's2', reps: 8, rpe: 8 },
          { id: 's3', reps: 7, rpe: 9 },
          { id: 's4', reps: 6, rpe: 10 },
        ]
      },
      {
        id: 'elog_2',
        exerciseId: 'push_4',
        exerciseName: 'Full Flat Push-ups',
        category: 'Push' as const,
        sets: [
          { id: 's5', reps: 15, rpe: 7 },
          { id: 's6', reps: 15, rpe: 7 },
          { id: 's7', reps: 12, rpe: 8 },
          { id: 's8', reps: 12, rpe: 9 },
        ]
      }
    ]
  },
  {
    id: 'log_2',
    date: '2026-05-24',
    routineName: 'Skill & static Power Workout',
    durationMinutes: 52,
    notes: 'Front lever tucks feeling solid! Worked hard on pike handstands.',
    exercisesLogged: [
      {
        id: 'elog_3',
        exerciseId: 'vpush_4',
        exerciseName: 'Wall Handstand Hold',
        category: 'Push' as const,
        sets: [
          { id: 's9', holdTime: 30, rpe: 7 },
          { id: 's10', holdTime: 35, rpe: 8 },
          { id: 's11', holdTime: 30, rpe: 9 },
        ]
      },
      {
        id: 'elog_4',
        exerciseId: 'core_4',
        exerciseName: 'Tuck Front Lever Hold',
        category: 'Core' as const,
        sets: [
          { id: 's12', holdTime: 10, rpe: 8 },
          { id: 's13', holdTime: 12, rpe: 9 },
          { id: 's14', holdTime: 8, rpe: 9 },
        ]
      }
    ]
  },
  {
    id: 'log_3',
    date: '2026-05-28',
    routineName: 'Fundamental Full Body Basics',
    durationMinutes: 48,
    notes: 'Improved on pull-up count. Pistol squating template initiated.',
    exercisesLogged: [
      {
        id: 'elog_5',
        exerciseId: 'pull_4',
        exerciseName: 'Full Dead-Hang Pull-ups',
        category: 'Pull' as const,
        sets: [
          { id: 's15', reps: 9, rpe: 8 },
          { id: 's16', reps: 8, rpe: 9 },
          { id: 's17', reps: 8, rpe: 9 },
          { id: 's18', reps: 7, rpe: 10 },
        ]
      },
      {
        id: 'elog_6',
        exerciseId: 'legs_3',
        exerciseName: 'Bulgarian Split Squats',
        category: 'Legs' as const,
        sets: [
          { id: 's19', reps: 12, rpe: 7 },
          { id: 's20', reps: 12, rpe: 8 },
          { id: 's21', reps: 12, rpe: 8 },
        ]
      }
    ]
  },
  {
    id: 'log_4',
    date: '2026-06-02',
    routineName: 'Custom Session',
    durationMinutes: 40,
    notes: 'Pushed limits on chest-to-bar pullups. Feels very strong.',
    exercisesLogged: [
      {
        id: 'elog_7',
        exerciseId: 'pull_6',
        exerciseName: 'Chest-To-Bar Pull-ups',
        category: 'Pull' as const,
        sets: [
          { id: 's22', reps: 6, rpe: 9 },
          { id: 's23', reps: 5, rpe: 9 },
          { id: 's24', reps: 5, rpe: 10 },
        ]
      },
      {
        id: 'elog_8',
        exerciseId: 'push_5',
        exerciseName: 'Diamond Push-ups',
        category: 'Push' as const,
        sets: [
          { id: 's25', reps: 12, rpe: 8 },
          { id: 's26', reps: 12, rpe: 8 },
          { id: 's27', reps: 10, rpe: 9 },
        ]
      }
    ]
  },
  {
    id: 'log_5',
    date: '2026-06-05',
    routineName: 'Skill & static Power Workout',
    durationMinutes: 55,
    notes: 'Last session of the week, level up incoming!',
    exercisesLogged: [
      {
        id: 'elog_9',
        exerciseId: 'vpush_4',
        exerciseName: 'Wall Handstand Hold',
        category: 'Push' as const,
        sets: [
          { id: 's28', holdTime: 40, rpe: 8 },
          { id: 's29', holdTime: 45, rpe: 9 },
          { id: 's30', holdTime: 40, rpe: 9 },
        ]
      },
      {
        id: 'elog_10',
        exerciseId: 'legs_6',
        exerciseName: 'Full Pistol Squat',
        category: 'Legs' as const,
        sets: [
          { id: 's31', reps: 6, rpe: 9 },
          { id: 's32', reps: 6, rpe: 9 },
          { id: 's33', reps: 5, rpe: 10 },
        ]
      }
    ]
  }
];
