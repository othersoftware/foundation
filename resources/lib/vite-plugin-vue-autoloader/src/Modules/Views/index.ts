import { ResolvedConfig } from 'vite';
import { writeComponentsDeclarations, compileViewsModule, writePhpstormMeta } from './Compiler';
import { collect } from '../../Services/Collector';
import { Options } from '../../Types/Options';

export function provideVirtualViewsModule(config: ResolvedConfig, options: Options, compile: boolean = true) {
  const target = Object.entries(options.target).at(0);

  if (!target) {
    throw new Error('Unknown target for output files!');
  }

  let [local, vendor] = target;
  const views = collect(config, options.views);

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
