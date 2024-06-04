"use client";

import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";

import { Google } from "@/components/icons/google";
import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import AuthApi from "@/services/auth";
import { SocialProvider } from "@/types/auth";

type SocialButtonsType = {
  type: "sigin" | "signup";
};

const SocialButtons: FC<SocialButtonsType> = ({ type }) => {
  const t = useTranslations();
  const { socialProviders } = useAuth();

  return (
    <>
      {socialProviders &&
        socialProviders.map((provider) => {
          switch (provider.name) {
            case "google-oauth2":
              return (
                <Button
                  key={provider.name}
                  href={provider.auth_url}
                  variant="tertiary"
                  size="sm"
                  className="mt-2 w-full"
                >
                  <Google className="mr-2 flex-none" />
                  <span className="flex-1 whitespace-nowrap text-center">
                    {type == "sigin"
                      ? t("loginGoogle")
                      : t("registrationGoogle")}
                  </span>
                </Button>
              );
            case "facebook":
              return (
                <Button
                  key={provider.name}
                  href={provider.auth_url}
                  variant="tertiary"
                  size="sm"
                  className="mt-2 w-full"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="mr-2 flex-none text-[#1877F2]"
                  />
                  <span className="flex-1 whitespace-nowrap text-center">
                    {type == "sigin" ? t("loginFB") : t("registrationFB")}
                  </span>
                </Button>
              );
          }
        })}
    </>
  );
};

export default SocialButtons;