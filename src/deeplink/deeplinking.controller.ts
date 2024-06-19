import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Public } from 'src/shared/public.decorator';
import { Response } from 'express';
import { join } from 'path';
import { title } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { Repository } from 'typeorm';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { list_entity } from 'src/list/entities/list.entity';

@Controller('redirect')
export class DeepLinkController {
  constructor(
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    @InjectRepository(list_entity)
    private readonly listRepository: Repository<list_entity>,
  ) {}
  @Public()
  @Get()
  async handleDeepLinking(@Query('path') path: string, @Res() res: Response) {
    const id: string = path.split('/')[1];
    const route: string = path.split('/')[0];
    if (!route && !id) {
      throw new BadRequestException('path needed');
    }
    let image: string;
    let title: string;
    let description: string;
    if (route === 'recipe') {
      const recipe: recipe_entity = await this.recipeRepository.findOne({
        where: { id: id },
      });
      image = 'https://api.patzenhoffer.eu/images/' + recipe.image;
      title = recipe.title;
      description = 'Pas de description fournie';
    }
    if (route === 'fridge') {
      const fridge: fridge_entity = await this.fridgeRepository.findOne({
        where: { id },
      });
      image = 'https://api.patzenhoffer.eu/images/' + fridge.image;
      title = fridge.title;
      description = fridge.description;
    }
    if (route === 'list') {
      const list: list_entity = await this.listRepository.findOne({
        where: { id: id },
      });
      image = 'https://api.patzenhoffer.eu/images/' + list.image;
      title = list.title;
      description = list.description;
    }

    res.send(`<!DOCTYPE html>
    <html lang="fr-FR">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <meta name="title" content=${title} />
        <meta name="description" content=${description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content=${title} />
        <meta property="og:description" content=${description} />
        <meta property="og:image" content=${image} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content=${title} />
        <meta property="twitter:description" content=${description} />
        <script type="text/javascript">
          window.onload = function () {
            window.location.href = "app.fopagacher://${path}";
          };
        </script>
      </head>
      <body>
        <header><img class="headerimage" src="https://api.patzenhoffer.eu/images/69e5e08a-5c85-4a5c-8f1d-f3b0c3f5e6a1" /></header>
        <div>
          <h2 class="title">Votre lien de partage</h2>
          <img class="sharedimage" src=${image} />
          <h3>${title}</h3>
          <h4>${description}</h4>
          <h5>
            Si vous n'êtes pas redirigé automatiquement,
            <a href="app.fopagacher://${path}">cliquez ici</a>
          </h5>
        </div>
        <div>
          <h4>
            Si vous n'avez pas l'application, vous pouvez la télécharger sur l'App
            Store ou le Google Play Store
          </h4>
          <div class="rowcontainer">
            <a class="storelinkgoogle" href="https://play.google.com/store/games/">
              <img class="storeimage" src="https://api.patzenhoffer.eu/images/f2e4ef1e-8674-4fa4-9c8d-20d27a3f52d9" alt="Fopagacher" />
            </a>
            <a class="storelinkapple" href="https://www.apple.com/app-store/">
              <img class="storeimage" src="https://api.patzenhoffer.eu/images/c6b2c5d5-f0a4-4a0f-a527-b4fd0d45c2c5" alt="Fopagacher" />
            </a>
          </div>
        </div>
      </body>
      <style>
        body {
          margin: 0;
          display: flex;
          min-height: 100vh;
          align-items: center;
          padding: 0 0 20px 0;
          flex-direction: column;
          background-color: whitesmoke;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
        }
        header {
          width: 100%;
          height: 10vh;
          display: flex;
          align-items: center;
          background: linear-gradient(to bottom, #90e9c5, #84ddb9);
        }
        img.headerimage {
          width: 100%;
          height: 80%;
          object-fit: contain;
        }
        div {
          width: 90%;
          display: flex;
          padding: 20px;
          margin-top: 20px;
          border-radius: 10px;
          align-items: center;
          flex-direction: column;
          background-color: white;
        }
        h2 {
          font-size: 2rem;
          font-weight: 800;
        }
        img.sharedimage {
          width: auto;
          border-radius: 10px;
        }
        h5 {
          margin-top: 10px;
          font-weight: 600;
          font-style: italic;
        }
        div.rowcontainer {
          width: 100%;
          height: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        a.storelinkapple {
          width: 40%;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        a.storelinkgoogle {
          width: 40%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img.storeimage {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      </style>
    </html>`);
  }
}
