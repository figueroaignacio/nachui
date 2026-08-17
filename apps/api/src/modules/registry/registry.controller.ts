import { ConflictException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { RegistryRepository } from './registry.repository';

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryRepository: RegistryRepository) {}

  @Get()
  async list() {
    return await this.registryRepository.findAll();
  }

  /**
   * Qualified lookup, `GET /registry/ui/button`.
   *
   * Declared before the single-segment route so Nest matches the more specific
   * pattern first.
   */
  @Get(':family/:name')
  async findQualified(@Param('family') family: string, @Param('name') name: string) {
    return this.resolveOrThrow(`${family}/${name}`);
  }

  /** Short lookup, `GET /registry/button`, kept for the published CLI. */
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.resolveOrThrow(slug);
  }

  private async resolveOrThrow(input: string) {
    const result = await this.registryRepository.resolve(input);

    if (result.status === 'found') return result.component;

    if (result.status === 'ambiguous') {
      throw new ConflictException(
        `NachUI: '${input}' existe en más de una familia (${result.candidates.join(', ')}). ` +
          `Pedilo con el nombre completo, por ejemplo '${result.candidates[0]}'.`,
      );
    }

    throw new NotFoundException(`NachUI: El componente '${input}' no existe.`);
  }
}
