import { ThreeDMarquee } from "./../components/ui/3d-marquee";
import image01 from "../components/Assets/AnimationRequired/image01.png";
import image02 from "../components/Assets/AnimationRequired/image02.png";
import image03 from "../components/Assets/AnimationRequired/image03.png";
import image04 from "../components/Assets/AnimationRequired/image04.png";
import image05 from "../components/Assets/AnimationRequired/image05.png";
import image06 from "../components/Assets/AnimationRequired/image06.png";
import image07 from "../components/Assets/AnimationRequired/image07.png";
import image08 from "../components/Assets/AnimationRequired/image08.png";
import image09 from "../components/Assets/AnimationRequired/image09.png";
import image10 from "../components/Assets/AnimationRequired/image10.png";
import image11 from "../components/Assets/AnimationRequired/image11.png";
import image12 from "../components/Assets/AnimationRequired/image12.png";
import image13 from "../components/Assets/AnimationRequired/image13.png";
import image14 from "../components/Assets/AnimationRequired/image14.png";
import image15 from "../components/Assets/AnimationRequired/image15.png";
import image16 from "../components/Assets/AnimationRequired/image16.png";
import image17 from "../components/Assets/AnimationRequired/image17.png";
import image18 from "../components/Assets/AnimationRequired/image18.png";
import image19 from "../components/Assets/AnimationRequired/image19.png";
import image20 from "../components/Assets/AnimationRequired/image20.png";
import image21 from "../components/Assets/AnimationRequired/image21.png";
import image22 from "../components/Assets/AnimationRequired/image22.png";
import image23 from "../components/Assets/AnimationRequired/image23.png";
import image24 from "../components/Assets/AnimationRequired/image24.png";
import image25 from "../components/Assets/AnimationRequired/image25.png";
import image26 from "../components/Assets/AnimationRequired/image26.png";
import image27 from "../components/Assets/AnimationRequired/image27.png";
import image28 from "../components/Assets/AnimationRequired/image28.png";
import image29 from "../components/Assets/AnimationRequired/image29.png";




// Merge local and remote images
const images = [
  image01,
  image02,
  image03,
  image04,
  image05,
  image06,
  image07,
  image08,
  image09,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
  image17,
  image18,
  image19,
  image20,
  image21,
  image22,
  image23,
  image24,
  image25,
  image26,
 image27,
  image28,
image29,
  "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
  "https://assets.aceternity.com/tabs.png",
  "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
  "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
  "https://assets.aceternity.com/glowing-effect.webp",
  "https://assets.aceternity.com/hover-border-gradient.png",
  "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
  "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
  "https://assets.aceternity.com/macbook-scroll.png",
  "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
  "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
  "https://assets.aceternity.com/multi-step-loader.png",
  "https://assets.aceternity.com/vortex.png",
  "https://assets.aceternity.com/wobble-card.png",
  "https://assets.aceternity.com/world-map.webp",
];

export default function ImageMarqueeSection() {
  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
