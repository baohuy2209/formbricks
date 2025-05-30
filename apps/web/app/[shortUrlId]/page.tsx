import { getShortUrl } from "@/lib/shortUrl/service";
import { getMetadataForLinkSurvey } from "@/modules/survey/link/metadata";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { logger } from "@formbricks/logger";
import { TShortUrl, ZShortUrlId } from "@formbricks/types/short-url";

export const generateMetadata = async (props): Promise<Metadata> => {
  const params = await props.params;
  if (!params.shortUrlId) {
    notFound();
  }

  if (ZShortUrlId.safeParse(params.shortUrlId).success !== true) {
    notFound();
  }

  try {
    const shortUrl = await getShortUrl(params.shortUrlId);

    if (!shortUrl) {
      notFound();
    }

    const surveyId = shortUrl.url.substring(shortUrl.url.lastIndexOf("/") + 1);
    return getMetadataForLinkSurvey(surveyId);
  } catch (error) {
    notFound();
  }
};

const Page = async (props) => {
  const params = await props.params;
  if (!params.shortUrlId) {
    notFound();
  }

  if (ZShortUrlId.safeParse(params.shortUrlId).success !== true) {
    // return not found if unable to parse short url id
    notFound();
  }

  let shortUrl: TShortUrl | null = null;

  try {
    shortUrl = await getShortUrl(params.shortUrlId);
  } catch (error) {
    logger.error(error, "Could not fetch short url");
    notFound();
  }

  if (shortUrl) {
    redirect(shortUrl.url);
  }

  notFound();
};

export default Page;
