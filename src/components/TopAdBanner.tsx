import AdBanner from "./AdBanner";

const TopAdBanner = () => {
  return (
    <div className="w-full bg-background/50 border-b border-border/40">
      <div className="container py-2">
        <AdBanner 
          slot="8592922064" 
          format="horizontal" 
          className="max-h-[120px]" 
        />
      </div>
    </div>
  );
};

export default TopAdBanner;
