import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-list-playlists",
  name: "List Playlists",
  description: "Returns a collection of playlists that match the API request parameters. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      propDefinition: [
        youtubeDataApi,
        "useCase",
      ],
      options: consts.LIST_PLAYLISTS_USE_CASE,
    },
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        ...youtubeDataApi.propDefinitions.playlistId,
      };
    }
    else if (this.useCase === "channelId") {
      dynamicProps.channelId = {
        ...youtubeDataApi.propDefinitions.channelId,
      };
    }
    return {
      ...dynamicProps,
      part: {
        ...youtubeDataApi.propDefinitions.part,
        options: consts.LIST_PLAYLISTS_PART_OPTS,
      },
      hl: {
        ...youtubeDataApi.propDefinitions.hl,
        options: async () => {
          return await this.youtubeDataApi.listI18nLanguagesOpts();
        },
      },
      maxResults: {
        ...youtubeDataApi.propDefinitions.maxResults,
      },
      onBehalfOfContentOwner: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwner,
      },
      onBehalfOfContentOwnerChannel: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwnerChannel,
      },
    };
  },
  async run({ $ }) {
    const {
      useCase,
      id,
      channelId,
      part,
      hl,
      maxResults,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
    } = this;

    const mine = useCase === "mine" ?
      true :
      undefined;

    const playlists = (await this.youtubeDataApi.listPlaylists({
      part,
      id,
      mine,
      channelId,
      hl,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
      maxResults,
    })).data;
    $.export("$summary", `Successfully fetched "${playlists.items.length}" playlists`);
    return playlists;
  },
};
