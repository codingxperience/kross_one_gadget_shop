/**
 * Per-product editorial content and questions.
 *
 * Why this module exists: 71 generated product pages previously carried roughly 250–550
 * characters of unique text each, wrapped in identical boilerplate. Google classified
 * almost all of them as "crawled/discovered — currently not indexed". Pages need to say
 * something specific and useful about the individual item to earn an index slot.
 *
 * Every sentence here must be defensible. Nothing asserts a price, a stock level, a
 * warranty length or a rating, because the store confirms those per item.
 */

const spec = (product, ...names) => {
  const specs = Array.isArray(product.specs) ? product.specs : [];
  for (const name of names) {
    const found = specs.find(([key]) => String(key).toLowerCase() === name.toLowerCase());
    if (found) return String(found[1]);
  }
  return null;
};

const isApple = (product) => /iphone|ipad|macbook|apple watch|airpods|beats/i.test(product.name);
const isSamsung = (product) => /samsung|galaxy/i.test(product.name);
const isPreOwned = (product) => /used|pre-?owned|refurb/i.test(`${product.id} ${product.tag || ''} ${spec(product, 'Condition') || ''}`);

const storageLine = (product) => {
  const storage = spec(product, 'Storage');
  if (!storage) return null;
  return storage.includes('/')
    ? `This model is made in several storage sizes (${storage}). Storage cannot be increased later on most devices, so choose the size before you buy rather than after.`
    : `This listing refers to the ${storage} configuration.`;
};

/**
 * Category guidance. Each entry returns sections specific to how that category is
 * actually bought in Kampala — grey imports, warranty scope, power and network
 * differences, and what to physically check in the shop.
 */
const categoryGuides = {
  mobiles: (product) => {
    const chip = spec(product, 'Chip', 'Processor');
    const camera = spec(product, 'Camera');
    const display = spec(product, 'Display');
    return [
      {
        heading: `Buying the ${product.name} in Kampala`,
        paragraphs: [
          `Phones reach Uganda through several routes, and the same model name can arrive as a sealed unit, an open-box unit or a pre-owned handset. Kross One Gadgets states which of those applies to the specific ${product.name} being sold, and the price follows the condition rather than the model name alone.`,
          storageLine(product) || `Confirm the exact configuration before paying, because storage and memory vary between units of the same model.`
        ].filter(Boolean),
        points: [
          display ? `Display: ${display}` : null,
          chip ? `Processor: ${chip}` : null,
          camera ? `Camera system: ${camera}` : null,
          'Ask whether the unit is sealed, open-box or pre-owned',
          'Confirm the warranty that applies to that individual handset'
        ].filter(Boolean)
      },
      {
        heading: 'What to check before you pay',
        paragraphs: [
          `Check these in the shop, with the ${product.name} in your hand, before money changes hands. A shop that is confident in its stock will not rush this part.`
        ],
        points: [
          'Dial *#06# and confirm the IMEI on screen matches the box and the receipt',
          isApple(product)
            ? 'Confirm the device is not locked to another Apple Account, and that Find My is switched off'
            : 'Confirm no previous Google account lock remains on the device',
          'Confirm the network bands work on MTN and Airtel Uganda',
          isPreOwned(product) ? 'Ask for the battery health percentage and see it on screen' : 'Confirm the seal and the included charger and cable',
          'Get a receipt that names the model, storage, condition, price and warranty'
        ]
      }
    ];
  },

  laptops: (product) => [
    {
      heading: `Choosing the ${product.name} in Uganda`,
      paragraphs: [
        `Laptop buyers in Kampala usually weigh three things: the work it must do, the warranty route if something fails locally, and the power arrangement. ${product.name} should be matched to the workload first — memory and storage are the parts that decide how long a machine stays comfortable to use.`,
        `Ask which regional variant is in stock. Keyboard layout, charger plug type and pre-installed operating system version differ between import routes, and those details are easier to settle before purchase than after.`
      ],
      points: [
        spec(product, 'Processor', 'Chip') ? `Processor: ${spec(product, 'Processor', 'Chip')}` : null,
        spec(product, 'Memory', 'RAM') ? `Memory: ${spec(product, 'Memory', 'RAM')}` : null,
        spec(product, 'Storage') ? `Storage: ${spec(product, 'Storage')}` : null,
        spec(product, 'Display') ? `Display: ${spec(product, 'Display')}` : null,
        'Confirm the charger supplied and whether it suits Ugandan sockets'
      ].filter(Boolean)
    },
    {
      heading: 'Warranty and service in Kampala',
      paragraphs: [
        'A manufacturer warranty is only useful if there is a way to act on it. Ask where a repair would actually be carried out, who pays for shipping if a unit must leave the country, and how long a typical turnaround takes. Kross One Gadgets confirms the warranty terms attached to the individual machine before purchase.'
      ],
      points: [
        'Ask whether the warranty is handled locally or through the manufacturer',
        'Confirm what the warranty excludes — liquid damage and screens are common exclusions',
        'Keep the receipt and the original packaging until the warranty period ends'
      ]
    }
  ],

  tablets: (product) => [
    {
      heading: `The ${product.name} for work and study in Uganda`,
      paragraphs: [
        `Tablets are bought here for two different jobs: a light second screen for reading and video, or a serious note-taking and drawing tool. ${product.name} suits whichever of those you are actually buying it for — the accessories decide more than the model name does.`,
        `Decide early between the Wi-Fi model and the cellular model. A cellular tablet takes a Ugandan SIM and works away from Wi-Fi; a Wi-Fi model does not, and cannot be upgraded later.`
      ],
      points: [
        spec(product, 'Display') ? `Display: ${spec(product, 'Display')}` : null,
        spec(product, 'Chip', 'Processor') ? `Chip: ${spec(product, 'Chip', 'Processor')}` : null,
        spec(product, 'Storage') ? `Storage: ${spec(product, 'Storage')}` : null,
        'Confirm whether the unit is Wi-Fi only or Wi-Fi plus cellular',
        'Ask which stylus and keyboard are compatible, if you need them'
      ].filter(Boolean)
    }
  ],

  audio: (product) => [
    {
      heading: `Listening to the ${product.name} before you buy`,
      paragraphs: [
        `Audio is the one category where a specification sheet settles very little. Fit, seal and how a pair sounds to your ears matter more than a driver size. Ask to hear the ${product.name} in the shop with your own music before deciding.`,
        `Counterfeit audio is common in this region and often convincing on the outside. Checking the serial number against the manufacturer's own verification page is the quickest way to be sure.`
      ],
      points: [
        spec(product, 'Battery') ? `Battery: ${spec(product, 'Battery')}` : null,
        spec(product, 'Driver', 'Drivers') ? `Drivers: ${spec(product, 'Driver', 'Drivers')}` : null,
        'Listen before buying — fit and seal decide comfort and bass',
        'Verify the serial number on the manufacturer site',
        'Confirm which ear tips, cable or case are included'
      ].filter(Boolean)
    }
  ],

  watches: (product) => [
    {
      heading: `${product.name}: what to confirm`,
      paragraphs: [
        `A smart watch depends on the phone it pairs with, so check compatibility before anything else. Some watches pair only with one phone platform, and a few features are unavailable outside certain countries.`,
        `Case size and band size are separate choices. Confirm both, and ask whether a different band size can be supplied if the fitted one does not suit your wrist.`
      ],
      points: [
        spec(product, 'Display') ? `Display: ${spec(product, 'Display')}` : null,
        spec(product, 'Battery') ? `Battery: ${spec(product, 'Battery')}` : null,
        'Confirm it pairs with your current phone',
        'Ask which health features are enabled for this region',
        'Confirm the case size and the band size supplied'
      ].filter(Boolean)
    }
  ],

  gaming: (product) => [
    {
      heading: `${product.name} in Uganda`,
      paragraphs: [
        `Console and gaming hardware sold in Uganda arrives in regional variants. The variant affects the power supply, the plug fitted and occasionally which online store the machine defaults to. None of that prevents normal use, but it is worth confirming rather than discovering later.`,
        `Ask what is in the box. Controller count, cables and any bundled titles vary between packages sold under the same model name.`
      ],
      points: [
        'Confirm the regional variant and the power supply fitted',
        'Confirm exactly what the box includes',
        'Ask about controller compatibility if you already own accessories'
      ]
    }
  ],

  'game-discs': (product) => [
    {
      heading: `Before you buy ${product.name}`,
      paragraphs: [
        `Game discs are tied to a console generation and sometimes to a region. Confirm the disc matches your console before buying, because an opened disc is rarely returnable.`,
        `Some titles need a large download after installation, and a few need an online account to play at all. Worth knowing before you get home.`
      ],
      points: [
        'Confirm the console generation the disc is made for',
        'Ask about the download size after installation',
        'Check whether an online account is required'
      ]
    }
  ],

  cameras: (product) => [
    {
      heading: `Shooting with the ${product.name}`,
      paragraphs: [
        `A camera body is the start of a system, not the whole of it. Lenses, cards and batteries usually decide both the final cost and the results more than the body does.`,
        `Ask whether the listed price covers a body only or a kit with a lens. The difference is substantial and is the most common misunderstanding in camera sales.`
      ],
      points: [
        'Confirm whether this is body-only or a kit with a lens',
        'Check the shutter count if the body is pre-owned',
        'Ask which memory card speed the camera needs for video',
        'Confirm the number of batteries included'
      ]
    }
  ],

  accessories: (product) => [
    {
      heading: `Matching the ${product.name} to your device`,
      paragraphs: [
        `Accessories are model-specific far more often than they look. A case, cable or charger that fits one generation frequently does not fit the next, even where the device looks similar.`,
        `Tell the shop the exact device model you own and let them confirm the fit before you pay. It takes a moment and avoids the most common accessory return.`
      ],
      points: [
        'Give the exact device model so fit can be confirmed',
        'For chargers, confirm the wattage your device actually supports',
        'For cables, confirm both the connector type and the data speed'
      ]
    }
  ],

  bags: (product) => [
    {
      heading: `Fitting your laptop in the ${product.name}`,
      paragraphs: [
        `Bag sizes are quoted by screen size, but thickness and the shape of a machine matter just as much. Bring the laptop, or its exact model name, so the fit can be checked properly.`,
        `If the bag will be carried daily in Kampala traffic, padding on the base and a water-resistant outer matter more than they might elsewhere.`
      ],
      points: [
        'Confirm the laptop size the compartment is built for',
        'Check base padding if you commute daily',
        'Ask about water resistance and the warranty on zips and straps'
      ]
    }
  ],

  travel: (product) => [
    {
      heading: `Travelling with the ${product.name}`,
      paragraphs: [
        `Airline cabin-size rules differ between carriers flying out of Entebbe, and a case that is accepted on one airline may be gate-checked on another. Confirm the external dimensions against the airline you fly most.`,
        `Wheels and handles fail long before the shell does. Ask what the warranty covers on those parts specifically.`
      ],
      points: [
        'Check the external dimensions against your usual airline',
        'Ask what the warranty covers on wheels, handles and zips',
        'Confirm whether the lock is TSA-compatible'
      ]
    }
  ],

  lifestyle: (product) => {
    const brand = spec(product, 'Brand');
    return [
      {
        heading: `Buying ${product.name} with confidence`,
        paragraphs: [
          `Fragrance is heavily counterfeited, and the copies have become good enough that packaging alone no longer settles it. Buying from a shop that will stand behind the item, and that lets you smell it first, is the practical protection.`,
          `${brand ? `${brand} produces` : 'Most houses produce'} several concentrations under similar names — eau de toilette, eau de parfum and parfum differ in strength and in how long they last. Confirm which one you are buying, because the names look almost identical on the box.`
        ],
        points: [
          brand ? `Brand: ${brand}` : null,
          spec(product, 'Fragrance') ? `Fragrance: ${spec(product, 'Fragrance')}` : null,
          'Confirm the concentration — EDT, EDP and parfum are different products',
          'Confirm the bottle size in millilitres',
          'Ask to smell it on skin before buying'
        ].filter(Boolean)
      }
    ];
  }
};

const genericGuide = (product) => [
  {
    heading: `About the ${product.name}`,
    paragraphs: [
      `${product.name} is listed by Kross One Gadgets at Shop #18A, Lugogo Mall. The catalogue describes the model; the shop confirms the exact item available on the day, its condition, its price and the warranty that applies to it.`,
      'Contact the team with the exact variant you want so availability can be checked before you travel to Lugogo.'
    ],
    points: ['Confirm the exact variant and what the box includes', 'Confirm the condition and the warranty on that item']
  }
];

/** Questions people genuinely ask, answered without inventing commercial facts. */
const buildFaqs = (product, { priced, priceLabel, categoryLabel }) => {
  const name = product.name;
  const faqs = [];

  faqs.push({
    question: `How much does the ${name} cost in Uganda?`,
    answer: priced
      ? `Kross One Gadgets lists the ${name} at ${priceLabel} at Shop #18A, Lugogo Mall, Kampala. Prices move with stock and configuration, so confirm the current figure for the exact variant on WhatsApp at 0752 117 111 before travelling.`
      : `Kross One Gadgets quotes the ${name} per item, because the price depends on the exact configuration and condition of the unit in stock. Message 0752 117 111 on WhatsApp with the variant you want and the shop replies with today's figure, the condition and the warranty.`
  });

  faqs.push({
    question: `Where can I buy the ${name} in Kampala?`,
    answer: `Kross One Gadgets sells the ${name} from Shop #18A, Lugogo Mall, on Lugogo Bypass in Kampala. The shop opens Monday to Saturday from 9:00 to 20:00 and Sunday from 10:00 to 18:00. Confirm the item is in stock before travelling, because catalogue listings describe models rather than guaranteeing shelf stock.`
  });

  if (isPreOwned(product)) {
    faqs.push({
      question: `Is this ${name} new or pre-owned?`,
      answer: `This listing covers a pre-owned ${name}. Kross One Gadgets states the condition, and where relevant the battery health, for the individual unit before purchase. A condition described for one unit is never applied silently to another.`
    });
  } else {
    faqs.push({
      question: `Is the ${name} sold by Kross One Gadgets genuine?`,
      answer: `Kross One Gadgets sells original products and confirms the condition of each item — sealed, open-box or pre-owned — before purchase. You can verify a serial or IMEI number against the manufacturer's own checker in the shop before paying.`
    });
  }

  const storage = spec(product, 'Storage');
  if (storage && storage.includes('/')) {
    faqs.push({
      question: `Which storage sizes of the ${name} are available?`,
      answer: `The ${name} is produced in ${storage}. Which of those is actually on the shelf changes week to week, so send the size you want to 0752 117 111 and the shop confirms availability and the price for that configuration.`
    });
  }

  faqs.push({
    question: `Does Kross One Gadgets deliver the ${name} outside Kampala?`,
    answer: `Ask about delivery when you confirm the item. Kross One Gadgets first confirms the exact ${categoryLabel.toLowerCase()} being purchased, its price and its condition, and then advises whether collection at Lugogo Mall or delivery to your district is the better option.`
  });

  return faqs;
};

/**
 * Turns this product's own spec sheet into prose. This is the main source of text that
 * is genuinely unique to the page: the values differ product by product, so the
 * sentences differ too, rather than repeating one category template 20 times.
 */
const specNarrators = {
  display: (value, product) => `The ${product.name} uses a ${value} panel. Screen size decides how the phone feels in a pocket as much as how it looks, so compare it against whatever you carry now before deciding.`,
  chip: (value, product) => `It runs on the ${value}. The processor is what keeps a device usable in its third and fourth year rather than its first, which matters more here than raw benchmark numbers.`,
  processor: (value) => `The processor fitted is the ${value}. Match it to the heaviest task you actually run, not the heaviest task you can imagine running.`,
  storage: (value) => value.includes('/')
    ? `Storage is offered as ${value}. On most modern devices this cannot be expanded after purchase, so the size you buy is the size you keep — and photos and video fill it faster than people expect.`
    : `This configuration carries ${value} of storage, which cannot be expanded later on this design.`,
  memory: (value) => `Memory is ${value}. This is the specification that decides how many applications stay open without reloading, and it is usually soldered, so it cannot be upgraded after purchase.`,
  ram: (value) => `Memory is ${value}, which governs how much you can keep open at once.`,
  camera: (value, product) => `The camera system is ${value}. Sensor size and processing matter more than the megapixel figure alone, so ask to take a few frames with the ${product.name} in the shop and look at them on a larger screen.`,
  battery: (value) => `Battery: ${value}. Real endurance depends on screen brightness and network conditions, both of which are demanding in Kampala, so treat quoted figures as a ceiling rather than an average.`,
  condition: (value, product) => `This ${product.name} listing is described as: ${value}. Kross One Gadgets confirms the condition of the individual unit before purchase, and a condition stated for one unit is never carried over to another.`,
  brand: (value) => `Made by ${value}.`,
  fragrance: (value, product) => `${product.name} is the ${value} composition. Fragrance reads differently on different skin, so a few minutes wearing it matters more than any written description.`,
  availability: (value) => `Availability note: ${value}.`,
  category: (value) => `Sold as ${value}.`
};

const specNarrative = (product) => {
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const sentences = specs
    .map(([name, value]) => {
      const narrator = specNarrators[String(name).toLowerCase()];
      return narrator ? narrator(String(value), product) : `${name}: ${value}.`;
    })
    .filter(Boolean);
  if (!sentences.length) return null;
  return {
    heading: `${product.name} specifications, explained`,
    paragraphs: sentences
  };
};

/** Positions the product against the actual alternatives on the shelf — unique per product. */
const comparisonSection = (product, related, categoryLabel) => {
  const names = related.slice(0, 4).map((item) => item.name);
  if (!names.length) return null;
  const list = names.length > 1
    ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
    : names[0];
  return {
    heading: `How the ${product.name} compares in store`,
    paragraphs: [
      `In the ${categoryLabel.toLowerCase()} range at Shop #18A, the ${product.name} sits alongside the ${list}. Specification sheets flatten the differences between these; handling them together does not.`,
      `Ask the team to put two of them in front of you on the same counter. Weight, screen size and finish are the things buyers change their mind about once they have held both, and that is a five-minute conversation rather than a returns process.`
    ]
  };
};

export const buildProductContent = (product, { categoryLabel, priced = false, priceLabel = null, related = [] } = {}) => {
  const guide = categoryGuides[product.cat] || genericGuide;
  const editorial = [
    specNarrative(product),
    ...(guide(product) || []),
    comparisonSection(product, related, categoryLabel || 'catalogue'),
    {
      heading: `Buying the ${product.name} from Kross One Gadgets`,
      paragraphs: [
        `Kross One Gadgets has traded in Kampala since 2013 and sells from Shop #18A at Lugogo Mall. The shop is an independent electronics retailer${isApple(product) ? ' and does not present itself as an Apple-owned store or an Apple Authorised Reseller' : isSamsung(product) ? ' selling Samsung devices alongside other brands' : ''}.`,
        `Every ${product.name} enquiry is answered with the same three facts before you commit: what the item actually is, what it costs today, and what happens if something goes wrong with it.`
      ],
      points: [
        `Confirm the exact ${product.name} variant in stock`,
        'Get today’s price, the condition and the warranty in writing',
        'Collect at Lugogo Mall, or ask whether delivery reaches your area'
      ]
    }
  ].filter(Boolean);

  return {
    editorial,
    faqs: buildFaqs(product, { priced, priceLabel, categoryLabel: categoryLabel || 'item' })
  };
};

export const relatedProducts = (product, catalog, limit = 6) => {
  const sameCategory = catalog.filter((item) => item.cat === product.cat && item.id !== product.id);
  if (sameCategory.length >= limit) {
    // Prefer neighbours in catalogue order so related sets differ between products
    const index = sameCategory.findIndex((item) => item.id > product.id);
    const start = index === -1 ? 0 : index;
    const rotated = [...sameCategory.slice(start), ...sameCategory.slice(0, start)];
    return rotated.slice(0, limit);
  }
  const fallback = catalog.filter((item) => item.id !== product.id && !sameCategory.includes(item));
  return [...sameCategory, ...fallback].slice(0, limit);
};
