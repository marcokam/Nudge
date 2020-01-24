
const FeatureToggles = {
    featureToggles: new Set(),
    init: function(data) {
        const featureNames = data.items.map(elem=>elem.name);
        this.featureToggles = new Set(featureNames);
    },

    hasFeature: function(featureName) {
        return this.featureToggles.has(featureName);
    }
};

export default FeatureToggles;


