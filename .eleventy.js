const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const slugify = require("slugify");

const input = "content";
const output = "dist";
const pathPrefix = '/learn';
const assetExts = "png,jpg,jpeg,svg,pdf,css";

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });
  eleventyConfig.addPlugin(syntaxHighlight, {
    // see https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/10
    alwaysWrapLineHighlights: true,
  });
  // shortcode example:
  // eleventyConfig.addShortcode("stcd", (p1) => `<p>ShortCode ${p1}</p>`);
  // requires opt-in for 0.x
  eleventyConfig.setDataDeepMerge(true);
  // copy as-is to output
  const assets = `${input}/**/*.{${assetExts}}`;
  eleventyConfig.addWatchTarget(assets);
  eleventyConfig.addPassthroughCopy(assets);
  eleventyConfig.addCollection("category", function (collection) {
    return collection.getAll()
      // .sort((a, b) => a.weight - b.weight) // didn't work
      .reduce(
        (accum, iter) => ({
          ...accum,
          [iter.data.category]: [
            ...(accum[iter.data.category] || []),
            iter,
          ]
        }), {});
  });

  return {
    dir: {
      input,
      output,
    },
    pathPrefix,
    markdownTemplateEngine: "njk",
  };
};
