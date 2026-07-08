import Anime from "@/animation/Anime";
import Header from "@/components/Header";

export default function layout({ children }) {
  return (
    <Anime>
      <Header>{children}</Header>
    </Anime>
  );
}
