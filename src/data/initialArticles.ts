import { Article } from '../types/blog';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'architecture-of-light-and-silence',
    title: 'The Architecture of Light and Silence: Spatial Inhabitance in the Modern Era',
    subtitle: 'How honest materials, natural aperture geometries, and unadorned volumes restore contemplative stillness in hyper-stimulated urban environments.',
    category: 'Architecture & Design',
    tags: ['Architecture', 'Minimalism', 'Urbanism', 'Spaces'],
    readTime: '6 min read',
    publishedAt: 'October 19, 2026',
    featuredTier: 'lead',
    coverImage: '/src/assets/images/editorial_architectural_light_1792472445796.jpg',
    author: {
      name: 'Elena Rostova',
      role: 'Architectural Theorist & Senior Fellow at Spatial Studies',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      bio: 'Writing on spatial phenomenology, tectonic honesty, and the cultural psychology of modern inhabited environments across Europe and East Asia.'
    },
    claps: 342,
    comments: [
      {
        id: 'c1',
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
        time: '3 hours ago',
        text: 'The observation about travertine holding the temperature of the morning sun resonates profoundly. Modern construction far too frequently equates luxury with glossy synthetic veneer rather than tectonic permanence.',
        likes: 18
      },
      {
        id: 'c2',
        author: 'Sora Tanaka',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
        time: 'Yesterday',
        text: 'Splendid essay. Reading this in Tokyo where acoustic stillness is the rarest commodity. The concept of an acoustic vestibule is something every civic planner must integrate.',
        likes: 12
      }
    ],
    content: `During the mid-century transition, light became recognized not merely as an ambient illuminant, but as an active structural element defining volumetric boundaries. When Louis Kahn famously remarked that the sun never knew how great it was until it struck the side of a building, he was pinpointing an immutable dialogue between raw mass and radiant void.

In our current century of frantic screen luminescence, the architectural demand has shifted. We no longer thirst for brightness; we starve for shadow. We seek spaces capable of holding silence without clinical coldness.

### 01. The Poetics of Travertine and Deep Reveal

Consider the travertine corridor pictured above. Notice how sunlight does not flood the gallery uniformly; rather, it grazes the textured surface at an acute raking angle. Every fissure, pocket, and mineral striation casts a micro-shadow. This micro-shadow slows down the human gaze. In perceptual psychology, visual texture of natural provenance lowers cortisol metrics by up to twenty-eight percent over thirty minutes of exposure.

True spatial serenity requires:
- High thermal mass materials that absorb and gently re-radiate diurnal solar cycles.
- Deep embrasures and floor-to-ceiling mullions that slice light into rhythmic cadences.
- Water bodies adjacent to glazed apertures to cast caustic, slow-moving light reflections along raw concrete ceilings.

> "A room is not simply an interior enclosure; it is a lens trained upon time. To build with light is to build with mortality, watching the season rotate across a solitary stone floor."

### 02. The Acoustic Sanctuary

Silence in civic architecture is not an absence of sound, but the deliberate curation of resonance. Smooth acoustic plaster paired with end-grain timber blocks absorbs high-frequency chatter while preserving warm low-end acoustics. When stepping into such an enclosure, an involuntary physiological sigh occurs. The central nervous system recognizes sanctuary.

As we plan our cities for the next half-century, the most daring architectural gesture will not be soaring kinetic spires or holographic facades. It will be the courage to carve out unmonetized, un-illuminated, quiet rooms where human beings can sit undisturbed.`
  },
  {
    id: 'the-lost-cadence-of-morning-prose',
    title: 'The Lost Cadence of Morning Prose: On Paper, Ink, and Deep Attention',
    subtitle: 'Why tactile friction remains an essential cognitive catalyst for sustained thought in an age of frictionless velocity.',
    category: 'Writing Craft',
    tags: ['Writing', 'Productivity', 'Cognition', 'Essays'],
    readTime: '4 min read',
    publishedAt: 'October 18, 2026',
    featuredTier: 'secondary',
    coverImage: '/src/assets/images/editorial_writing_desk_1792472445478.jpg',
    author: {
      name: 'Julian Montgomery',
      role: 'Essayist & Literary Critic',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      bio: 'Author of three collections on epistolary traditions and the cognitive mechanics of analog synthesis.'
    },
    claps: 219,
    comments: [
      {
        id: 'c3',
        author: 'Claire Delacroix',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
        time: '5 hours ago',
        text: 'The distinction between drafting on paper and editing on screens is my absolute gospel. The fountain pen allows zero backspacing—you have to think the full clause through.',
        likes: 9
      }
    ],
    content: `Every morning before the house wakes, there exists an unblemished half-hour. The desk is clear save for an open linen-bound journal, a brass-capped fountain pen, and a cup of single-origin black roast steaming against the cool morning glass.

To set steel nib to cotton rag paper is to commit to irreversibility. When composing on digital glass, each word is contingent—subject to immediate erasure, backspace, and real-time spell-check red lines. The consequence is shallow hesitation.

### The Friction Hypothesis

Analog tools provide tactile resistance. Cognitive psychologists refer to this as *haptic feedback gating*. When your motor neurons feel the physical drag of pigment settling into paper fibers, thought slows down just enough to synchronize with expression.

1. **Commitment to the Line**: You do not delete; you cross out with a single clean stroke, leaving your cognitive false starts visible as historical evidence of thought.
2. **Peripheral Blindness**: There are no notification counters, battery percentages, or browser tab ribbons calling for your diversion.
3. **Spatial Memory**: You recall an argument because it lived on the bottom-right quadrant of a dog-eared cream page, not at pixel coordinate 1420.

If your writing feels fragmented or brittle, banish your glass screens until eleven o'clock. Sit with paper, and let the sentence unfold at the speed of hand and heartbeat.`
  },
  {
    id: 'algorithmic-poetics-and-ambient-intelligence',
    title: 'Algorithmic Poetics: Designing Ambient Intelligence Without Cognitive Overload',
    subtitle: 'Moving beyond intrusive notification paradigms toward calm computing and translucent ambient systems.',
    category: 'Future Systems',
    tags: ['AI', 'Interfaces', 'Technology', 'Philosophy'],
    readTime: '5 min read',
    publishedAt: 'October 16, 2026',
    featuredTier: 'secondary',
    coverImage: '/src/assets/images/editorial_future_technology_1792472446210.jpg',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Principal Researcher in Human-Machine Systems',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      bio: 'Investigating calm technology, embodied interaction, and post-glass human interfaces.'
    },
    claps: 185,
    comments: [
      {
        id: 'c4',
        author: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
        time: '1 day ago',
        text: 'Mark Weiser’s vision of Calm Technology was decades ahead of its time. Delighted to see this lineage carried forward into modern AI system design.',
        likes: 14
      }
    ],
    content: `In 1996, Mark Weiser and John Seely Brown penned their seminal thesis on Calm Technology: "The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it."

For the past fifteen years, consumer software took the exact opposite path: high-salience audio alerts, red badge counters, vibrating wristbands, and dopamine-tuned feed algorithms designed to hijack the limbic system.

### The Return of the Ambient Edge

We are now observing the dawn of *Ambient Intelligence*. Rather than interrupting the user with demanding dialogues, ambient systems reside gently in the periphery of perception.

- **Information as Environmental State**: Changing light temperature or subtle acoustic cues rather than jarring push banners.
- **Contextual Anticipation**: Interfaces that materialize only when intentional physical proximity is established.
- **Graceful Degradation**: Software that functions with dignified simplicity when offline, rather than panicking with modal error dialogs.

The highest virtue of contemporary engineering is restraint. The best machine is not the one that speaks loudest, but the one that understands when silence is sacred.`
  },
  {
    id: 'the-enduring-weight-of-fired-clay',
    title: 'The Enduring Weight of Fired Clay: Material Memory in Artisan Ceramics',
    subtitle: 'Why handcrafted imperfections outlive industrial precision and speak directly to human vulnerability.',
    category: 'Craft & Design',
    tags: ['Craft', 'Art', 'Ceramics', 'Culture'],
    readTime: '5 min read',
    publishedAt: 'October 14, 2026',
    featuredTier: 'standard',
    coverImage: '/src/assets/images/editorial_artisan_craft_1792472447628.jpg',
    author: {
      name: 'Naomi Chen-Kaufmann',
      role: 'Ceramicist & Material Heritage Curator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
      bio: 'Studying wood-firing kilns, mineral glazes, and wabi-sabi philosophy between Kyoto and San Francisco.'
    },
    claps: 164,
    comments: [],
    content: `Pick up an industrially cast porcelain mug from a multinational retail chain. Turn it over. The glaze is uniformly 0.4 millimeters thick. The rim has a tolerance of less than one-tenth of a millimeter. It is mathematically flawless, and completely dead.

Now pick up a wood-fired stoneware chawan thrown on a kick-wheel. Feel the slight asymmetry where the potter’s thumb pressed into the base. Notice the reduction spot where airborne wood ash drifted across the kiln chamber at 1,280 degrees Celsius and vitrified into an unexpected olive-green melt.

That vessel is alive because it carries the memory of an uncontrollable elemental event: earth, water, human breath, and wood fire. In our mechanized era, owning such an object is an act of quiet rebellion against the tyranny of synthetic perfection.`
  },
  {
    id: 'in-defense-of-slowness',
    title: 'In Defense of Slowness: Why Intellectual Longevity Demands Friction',
    subtitle: 'Resisting the pressure to produce hot takes, and reclaiming the virtue of the multi-month essay.',
    category: 'Philosophy',
    tags: ['Philosophy', 'Culture', 'Writing', 'Thinking'],
    readTime: '7 min read',
    publishedAt: 'October 11, 2026',
    featuredTier: 'standard',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Julian Montgomery',
      role: 'Essayist & Literary Critic',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      bio: 'Author of three collections on epistolary traditions and the cognitive mechanics of analog synthesis.'
    },
    claps: 290,
    comments: [],
    content: `The modern internet rewards velocity above all else. When an event occurs, commentary must be published within twenty minutes to capture the crest of the algorithmic wave. 

Yet almost every thought conceived in twenty minutes is worthless three weeks later. The greatest essays in the English language—Montaigne, Woolf, Didion, Baldwin—were not composed in an afternoon. They were simmered. They were tested against seasons, revised when initial anger cooled, and pruned until only muscular necessity remained.

Let us build platforms where ideas can rest and mature like wine, rather than spoil like cut fruit.`
  }
];
