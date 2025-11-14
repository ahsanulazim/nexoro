import Marquee from "react-fast-marquee";
import images from "@/json/marqueeImage.json"
import Image from "next/image";

export default function CardsMarquee({ direction }) {
    return (
        <Marquee speed={30} autoFill={true} className="overflow-visible" direction={direction ? direction : "left"}>
            {images.map((image) =>
                <Image height={800} width={450} key={image.id} src={image.image} alt={image.title} className="max-w-80 mx-3 rounded-xl" />
            )}
        </Marquee>
    )
}
