import { LOCALES } from "@/i18n/config";
import { checkReferences, readContent } from "@/content/load";
import { checkSigns, readSigns } from "@/content/signs";
import fs from "node:fs";
import path from "node:path";

let failed = false;
for (const locale of LOCALES) {
  if (!fs.existsSync(path.join(process.cwd(), "content", locale))) continue;
  try {
    const content = readContent(locale);
    const errors = checkReferences(content);
    const signsFile = path.join(process.cwd(), "content", locale, "signs.json");
    if (fs.existsSync(signsFile))
      errors.push(...checkSigns(readSigns(locale), new Set(content.lessons.keys())));
    if (errors.length) {
      failed = true;
      console.error(`✗ content/${locale}: ${errors.length} problem(s)`);
      for (const e of errors) console.error(`  - ${e}`);
    } else {
      console.log(
        `✓ content/${locale}: ${content.levels.length} levels, ${content.modules.size} modules, ` +
          `${content.lessons.size} lessons, ${content.questions.size} questions, ${content.rules.length} rules`,
      );
    }
  } catch (err) {
    failed = true;
    console.error(`✗ content/${locale}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
process.exit(failed ? 1 : 0);
