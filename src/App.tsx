import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Layout from '@modules/layout';
import CustomSwitch from '@modules/common/components/CustomSwitch';
import HomePage from '@modules/home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WalletConnect } from '@modules/providers/WalletConnect';

const modulesData = [{ path: '/', title: 'home', component: HomePage }];

const isBrowserSupportsHistory = 'pushState' in window.history;
const queryClient = new QueryClient();
const NoFound = () => <Redirect to="/404" />;

function App() {
  return (
    <BrowserRouter forceRefresh={!isBrowserSupportsHistory}>
      <QueryClientProvider client={queryClient}>
        <WalletConnect>
          <Layout>
            <CustomSwitch>
              {modulesData.map(({ path, title, component }) => (
                <Route exact key={title} path={path} component={component} />
              ))}
              <Route component={NoFound} key="pageNotFound" />
            </CustomSwitch>
          </Layout>
        </WalletConnect>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
