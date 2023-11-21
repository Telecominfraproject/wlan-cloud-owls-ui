import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AuthProviderProps, AuthProviderReturn, getOwlsAdmin, useGetConfigurationDescriptions } from './utils';
import {
  axiosAnalytics,
  axiosFms,
  axiosGw,
  axiosInstaller,
  axiosOwls,
  axiosProv,
  axiosRrm,
  axiosSec,
  axiosSub,
} from 'constants/axiosInstances';
import {
  useDeleteAccountToken,
  useGetAvatar,
  useGetPreferences,
  useGetProfile,
  useUpdatePreferences,
} from 'hooks/Network/Account';
import { useGetEndpoints } from 'hooks/Network/Endpoints';
import { Endpoint } from 'models/Endpoint';
import { Preference } from 'models/Preference';

const AuthContext = React.createContext({} as AuthProviderReturn);

export const AuthProvider = ({ token, defaultEndpoints, children }: AuthProviderProps) => {
  const ref = useRef();
  const [loadedEndpoints, setLoadedEndpoints] = useState(defaultEndpoints !== undefined);
  const [currentToken, setCurrentToken] = useState(token);
  const [endpoints, setEndpoints] = useState<{ [key: string]: string } | null>(defaultEndpoints ?? null);
  const { data: configurationDescriptions } = useGetConfigurationDescriptions({
    enabled: loadedEndpoints && defaultEndpoints === undefined,
  });
  const [owlsAdminCount, setOwlsAdminCount] = useState(0);
  const { data: user, refetch: refetchUser } = useGetProfile();
  const { refetch: refetchEndpoints } = useGetEndpoints({
    onSuccess: async (newEndpoints: Endpoint[]) => {
      const foundEndpoints: { [key: string]: string } = {};
      const { endpoint: owlsAdmin, owlsAdminCount: owlsCount } = await getOwlsAdmin(
        newEndpoints,
        // @ts-ignore
        axiosSec.defaults.headers.common.Authorization ?? '',
      );
      setOwlsAdminCount(owlsCount);
      if (owlsAdmin) {
        axiosOwls.defaults.baseURL = `${owlsAdmin.uri}/api/v1`;
      }
      for (const endpoint of newEndpoints) {
        foundEndpoints[endpoint.type] = endpoint.uri;
        switch (endpoint.type) {
          case 'owprov':
            axiosProv.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owfms':
            axiosFms.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owgw':
            axiosGw.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owsub':
            axiosSub.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owanalytics':
            axiosAnalytics.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owinstaller':
            axiosInstaller.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          default:
            break;
        }
      }
      setEndpoints(foundEndpoints);
      setLoadedEndpoints(true);
    },
  });
  const userId = user?.id ?? '';
  const userAvatar = user?.avatar ?? '';
  const { data: preferences } = useGetPreferences({ enabled: !!userId });
  const { data: avatar, refetch: refetchAvatar } = useGetAvatar({
    id: userId,
    enabled: !!userId && userAvatar !== '0' && userAvatar !== '',
    cache: userAvatar,
  });
  const updatePreferences = useUpdatePreferences();

  const logout = useDeleteAccountToken({ setCurrentToken });
  const logoutUser = () => logout.mutateAsync(currentToken ?? '');

  const getPref = (preference: string) => {
    for (const pref of preferences ?? []) {
      if (pref.tag === preference) return pref.value;
    }
    return null;
  };

  const setPref = async ({ preference, value }: { preference: string; value: string }) => {
    let updated = false;
    if (preferences) {
      const newPreferences: Preference[] = preferences.map((pref: Preference) => {
        if (pref.tag === preference) {
          updated = true;
          return { tag: pref.tag, value };
        }
        return pref;
      });

      if (!updated) newPreferences.push({ tag: preference, value });

      await updatePreferences.mutateAsync(newPreferences);
    }
  };

  const setPrefs = async (preferencesToUpdate: Preference[]) => {
    if (preferences) {
      const updatedPreferences: string[] = [];
      const newPreferences = preferences.map((pref: Preference) => {
        const preferenceToUpdate = preferencesToUpdate.find(
          (prefToUpdate: Preference) => prefToUpdate.tag === pref.tag,
        );
        if (preferenceToUpdate) {
          updatedPreferences.push(pref.tag);
          return { tag: pref.tag, value: preferenceToUpdate.value };
        }
        return pref;
      });

      for (const preferenceToUpdate of preferencesToUpdate) {
        if (!updatedPreferences.includes(preferenceToUpdate.tag)) {
          newPreferences.push(preferenceToUpdate);
        }
      }

      await updatePreferences.mutateAsync(newPreferences);
    }
  };

  const deletePref = async (preference: string | string[]) => {
    if (preferences) {
      const newPreferences: Preference[] = preferences.filter((pref: Preference) =>
        typeof preference === 'string' ? pref.tag !== preference : !preference.includes(pref.tag),
      );

      await updatePreferences.mutateAsync(newPreferences);
    }
  };

  useEffect(() => {
    if (currentToken) {
      axiosSec.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosGw.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosProv.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosFms.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosSub.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosOwls.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosAnalytics.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosInstaller.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosRrm.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      refetchUser();
      if (defaultEndpoints === undefined) refetchEndpoints();
    }
  }, [currentToken]);

  const value: AuthProviderReturn = useMemo(
    () => ({
      avatar: avatar?.data
        ? `data:;base64,${btoa(
            new Uint8Array(avatar.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),
          )}`
        : '',
      refetchUser,
      refetchAvatar,
      user,
      token: currentToken,
      setToken: setCurrentToken,
      logout: logoutUser,
      ref,
      getPref,
      setPref,
      setPrefs,
      deletePref,
      endpoints,
      configurationDescriptions,
      isUserLoaded: preferences !== undefined && user !== undefined && loadedEndpoints,
      owlsAdminCount,
    }),
    [
      currentToken,
      user,
      avatar,
      preferences,
      loadedEndpoints,
      configurationDescriptions,
      endpoints,
      ref,
      owlsAdminCount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthProvider.defaultProps = {
  token: '',
};

export const useAuth: () => AuthProviderReturn = () => React.useContext(AuthContext);
