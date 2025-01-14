/**
 * @since 2020-04-28 14:37
 * @author vivaxy
 */
import load from '@commitlint/load';
import { RulesConfig } from '@commitlint/types/lib/load';

async function loadRules(cwd: string) {
  try {
    const { rules } = await load({}, { cwd });
    return rules;
  } catch (e) {
    // catch if `Cannot find module "@commitlint/config-conventional"` happens.
    return {};
  }
}

export type CommitlintRules = {
  typeEnum: string[];
  scopeEnum: string[];
  subjectMaxLength: number;
  bodyMaxLength: number;
  footerMaxLength: number;
};

export async function getRules({
  cwd,
}: {
  cwd: string;
}): Promise<CommitlintRules> {
  const rules: Partial<RulesConfig> = await loadRules(cwd);

  function getRuleValue<T>(key: keyof RulesConfig, defaultValue: T) {
    // @ts-ignore
    const [level, applicable, value] = rules[key] || [0, 'never', defaultValue];
    if (level === 2 && applicable === 'always') {
      return ((value as unknown) as T) || defaultValue;
    }
    return defaultValue;
  }

  return {
    typeEnum: getRuleValue<string[]>('type-enum', []), // [] means use the default types
    scopeEnum: getRuleValue<string[]>('scope-enum', []), // [] means everything is ok
    subjectMaxLength: getRuleValue<number>('subject-max-length', Infinity),
    bodyMaxLength: getRuleValue<number>('body-max-length', Infinity),
    footerMaxLength: getRuleValue<number>('footer-max-length', Infinity),
  };
}
