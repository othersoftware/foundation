import { ResolvedConfig } from 'vite';
import { writeComponentsDeclarations, compileViewsModule, writePhpstormMeta } from './Compiler';
import { collect } from '../../Services/Collector';
import { Options } from '../../Types/Options';
import { resolveTargetDirectory } from '../../Utils/Target.ts';

export function provideVirtualViewsModule(config: ResolvedConfig, options: Options, compile: boolean = true) {
  const target = resolveTargetDirectory(options.target);

  if (!target) {
    throw new Error('Unknown target for output files!');
  }

  let [local, vendor] = target;
  const views = collect(config, options.views, options.namespace);

  if (vendor) {
    writeComponentsDeclarations(config, vendor);
    writePhpstormMeta(config, vendor, views.vendors);
  }

  writeComponentsDeclarations(config, local);
  writePhpstormMeta(config, local, views.components);

  if (compile) {
    return compileViewsModule(views.components);
  }

  return null;
}
