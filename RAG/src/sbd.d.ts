declare module "sbd" {
  interface Options {
    newline_boundaries?: boolean;
    html_boundaries?: boolean;
    sanitize?: boolean;
    allowed_tags?: boolean;
    preserve_whitespace?: boolean;
    abbreviations?: string[] | null;
  }

  function sentences(text: string, options?: Options): string[];

  export = { sentences };
}
