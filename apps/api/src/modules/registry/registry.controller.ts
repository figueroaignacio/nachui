import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
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

    if (result.status === 'invalid') {
      throw new BadRequestException(
        `NachUI: '${input}' is not a valid slug. Use a name like 'button' or 'ui/button'.`,
      );
    }

    if (result.status === 'ambiguous') {
      throw new ConflictException(
        `NachUI: '${input}' exists in more than one family (${result.candidates.join(', ')}). ` +
          `Ask for it by its full name, for example '${result.candidates[0]}'.`,
      );
    }

    throw new NotFoundException(`NachUI: the component '${input}' does not exist.`);
  }
}
