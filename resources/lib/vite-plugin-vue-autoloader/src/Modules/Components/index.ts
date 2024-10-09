import { ResolvedConfig } from 'vite';
import { writeComponentsDeclarations, writeVueDeclarations, compileComponentsModule } from './Compiler';
import { collect } from '../../Services/Collector';
import { Options } from '../../Types/Options';
import { resolveTargetDirectory } from '../../Utils/Target.ts';

export function provideVirtualComponentsModule(config: ResolvedConfig, options: Options, compile: boolean = true) {
  const target = resolveTargetDirectory(options.target);

  if (!target) {
    throw new Error('Unknown target for output files!');
  }

  let [local, vendor] = target;
  let views = collect(config, options.components);

  if (vendor) {
    writeComponentsDeclarations(config, vendor, views.vendors);
    writeVueDeclarations(config, vendor, views.vendors);
  }

  writeComponentsDeclarations(config, local, views.components);
  writeVueDeclarations(config, local, views.components);

  if (compile) {
    return compileComponentsModule(views.components);
  }

  return null;
}
