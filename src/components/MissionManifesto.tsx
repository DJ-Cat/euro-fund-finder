const MissionManifesto = () => {
  return (
    <section className="border-y-2 border-foreground py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-foreground">
          {/* The "Gap" Statement - Large typography block */}
          <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-foreground p-12 lg:p-16 bg-background flex items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                European innovation is stalling.
              </h2>
              <p className="text-2xl lg:text-3xl font-bold leading-tight">
                Not due to a lack of ideas, but a lack of transparent capital.
              </p>
            </div>
          </div>

          {/* The Public Funding Spotlight - Blue background block */}
          <div className="p-12 lg:p-16 bg-primary text-primary-foreground flex items-center">
            <div>
              <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">
                €52 BILLION IN EU GRANTS
              </h3>
              <p className="text-xl lg:text-2xl font-semibold leading-relaxed mb-4">
                Billions in EU Grants go unclaimed every year.
              </p>
              <p className="text-lg lg:text-xl leading-relaxed">
                We decode the bureaucracy to get you non-dilutive capital.
              </p>
            </div>
          </div>

          {/* The "Builder's Promise" - Bottom spanning block */}
          <div className="lg:col-span-2 border-t-2 border-foreground p-12 lg:p-16 bg-secondary">
            <div className="max-w-4xl">
              <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">
                THE BUILDER'S PROMISE
              </h3>
              <p className="text-xl lg:text-2xl font-semibold leading-relaxed">
                You build the product. We'll handle the paperwork.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-l-4 border-foreground pl-4">
                  <p className="text-lg font-bold mb-1">NO EQUITY DILUTION</p>
                  <p className="text-muted-foreground">Keep 100% ownership</p>
                </div>
                <div className="border-l-4 border-foreground pl-4">
                  <p className="text-lg font-bold mb-1">ZERO BUREAUCRACY</p>
                  <p className="text-muted-foreground">We file for you</p>
                </div>
                <div className="border-l-4 border-foreground pl-4">
                  <p className="text-lg font-bold mb-1">FULL TRANSPARENCY</p>
                  <p className="text-muted-foreground">Know where you stand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionManifesto;
