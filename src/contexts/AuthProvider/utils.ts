/* eslint-disable no-await-in-loop */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosProv } from 'constants/axiosInstances';
import { SimulationStatus } from 'hooks/Network/Simulations';
import { User } from 'hooks/Network/Users';
import { Endpoint } from 'models/Endpoint';
import { Preference } from 'models/Preference';

const getConfigDescriptions = async (baseUrl: string) =>
  axios.get(`${baseUrl.split('/api')[0]}/wwwassets/ucentral.schema.pretty.json`).then(({ data }) => data.$defs);

export const useGetConfigurationDescriptions = ({ enabled }: { enabled: boolean }) =>
  useQuery(['get-configuration-descriptions'], () => getConfigDescriptions(axiosProv.defaults.baseURL ?? ''), {
    staleTime: Infinity,
    enabled,
  });
export interface AuthProviderProps {
  token?: string;
  defaultEndpoints?: { [k: string]: string };
  children: React.ReactNode;
}

export interface AuthProviderReturn {
  avatar: string;
  refetchUser: () => void;
  refetchAvatar: () => void;
  user?: User;
  token?: string;
  setToken: (token: string) => void;
  logout: () => void;
  getPref: (preference: string) => string | null;
  setPref: ({ preference, value }: { preference: string; value: string }) => Promise<void>;
  setPrefs: (preferencesToUpdate: Preference[]) => Promise<void>;
  deletePref: (preference: string | string[]) => Promise<void>;
  ref: React.MutableRefObject<undefined>;
  endpoints: { [key: string]: string } | null;
  configurationDescriptions: Record<string, unknown>;
  isUserLoaded: boolean;
}

export const getOwlsStatus = (endpoint: Endpoint, token: string) =>
  axios
    .get(`${endpoint.uri}/api/v1/owlsSystemConfiguration`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then(
      ({ data }) =>
        data as {
          master: boolean;
          publicURI: string;
          privateURI: string;
          version: string;
          simulations: SimulationStatus[];
        },
    )
    .catch(() => null);

export const useGetOwlStatus = ({
  endpoint,
  token,
  enabled,
}: {
  endpoint: Endpoint;
  token: string;
  enabled?: boolean;
}) => useQuery(['owl-status', endpoint, token], () => getOwlsStatus(endpoint, token), { staleTime: Infinity, enabled });

export const getOwlsAdmin = async (endpoints: Endpoint[], token: string) => {
  let owlsTypeCount = 0;
  let owlsAdmin: Endpoint | undefined;
  for (const endpoint of endpoints) {
    if (endpoint.type === 'owls') {
      owlsTypeCount += 1;

      const res = await getOwlsStatus(endpoint, token);

      if (res && res.master) {
        owlsAdmin = endpoint;
        break;
      }
    }
  }

  if (owlsTypeCount === 1) {
    return endpoints.find((endpoint) => endpoint.type === 'owls');
  }

  return owlsAdmin;
};
