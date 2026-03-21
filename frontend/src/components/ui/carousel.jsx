import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CarouselContext = createContext(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel chỉ được dùng bên trong <Carousel />");
  }
  return context;
}

function Carousel({
  className,
  children,
  opts,
  setApi,
  orientation = "horizontal",
  plugins,
  ...props
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!emblaApi || !setApi) return;
    setApi(emblaApi);
  }, [emblaApi, setApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial state sync required by embla-carousel
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        canScrollNext,
        canScrollPrev,
        carouselApi: emblaApi,
        carouselRef: emblaRef,
        orientation,
        scrollNext,
        scrollPrev,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern requires role=region on wrapper */}
      <div
        aria-roledescription="băng chuyển"
        className={cn("relative", className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className="overflow-hidden" ref={carouselRef}>
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();

  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel slide pattern requires div with role=group
    <div
      aria-roledescription="slide trình chiếu"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      role="group"
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { canScrollPrev, orientation, scrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Slide trước</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { canScrollNext, orientation, scrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Slide sau</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
