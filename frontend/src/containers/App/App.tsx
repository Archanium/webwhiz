import * as React from "react";
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	List,
	ListIcon,
	ListItem,
	Menu,
	MenuButton,
	MenuDivider,
	Progress,
	MenuItem,
	MenuList,
	Spinner,
	VStack,
	Heading,
	Text,
} from "@chakra-ui/react";


import styles from "./App.module.scss";

import { Link, NavLink, Route, Switch } from "react-router-dom";
import { Logo } from "../../components/Logo/Logo";
import { ChatbotList } from "../ChatbotList/ChatbotList";
import { Settings } from "../Settings/Settings";
import { getUserProfile } from "../../services/userServices";
import { CurrentUser, User } from "../../services/appConfig";
import { DemoChatbots } from "../DemoChatbots/DemoChatbots";
import classNames  from "classnames";
import { formatNumber } from "../../utils/commonUtils";
interface AppProps {
	onLoginOut: () => void;
}

export const App = (props: AppProps) => {
	const [userData, setUserData] = React.useState<User | null>(null);
	React.useEffect(() => {
		async function fetchData() {
			try {
				const response = await getUserProfile();
				CurrentUser.set(response.data);
				setUserData(response.data);
			} catch (error) {
				console.log("Unable to user profile", error);
			} finally {
			}
		}
		fetchData();
	}, []);

	const getUsageComponent = React.useCallback(() => {

		if(!userData) return null

		try {	
			let usage = (userData.monthUsage.count * 100 ) / userData?.subscriptionData?.maxTokens;

			usage = usage.toFixed(2);

			let isExceded = false;
			
			if(userData?.subscriptionData?.maxTokens !== undefined) {
				isExceded = userData.monthUsage.count >= userData?.subscriptionData?.maxTokens
			}


			return <Box className={classNames(styles.usageCont, {
				[styles.usageContExceeded]: isExceded,
			})}>
				<Heading className={styles.usagePlan} size="h4" color="gray.500">{(userData?.subscriptionData?.name || '').toLowerCase().replace('app sumo', 'LTD')} plan</Heading>
				<Box className={styles.usgaeNumbers}><Text as="span" fontWeight="bold">{formatNumber(userData.monthUsage.count)}</Text> / {formatNumber(userData?.subscriptionData?.maxTokens)}</Box>
				<Text className={styles.usageLabel} fontSize="sm">Monthly usage limits</Text>
				<Progress className={styles.progressbar} w="100%" value={usage} size='sm' colorScheme={isExceded ? 'red': 'blue'} borderRadius="md" />
				{
					(userData?.subscriptionData?.type !== 'LIFETIME') ? (<Box w="100%" className={styles.usageUpgradeBtn}>
					<Link to="/app/settings/subscription/">
						<Button
							w="100%"
							colorScheme="gray"
							variant="solid"
							size="sm"
						>
							Upgrade now
						</Button>
					</Link>
				</Box>) : null
				}
				
			</Box>
		} catch (error) {
			console.log("error", error);
			return null
		}

	}, [userData]);
	return (
		<VStack spacing="0" w="100%" h="100vh">
			<Flex
				shrink={0}
				shadow="base"
				w="100%"
				h="60px"
				bg="white"
				justifyContent="space-between"
				pr="10"
				pb="4"
				pt="4"
				pl="10"
				zIndex="2"
				alignItems="center"
			>
				<Logo></Logo>
				<Box>
					<Menu>
						<MenuButton>
							<Avatar size="sm" bg="teal.500" />
						</MenuButton>
						<MenuList minW="180px">
							<MenuItem fontSize="small">
								<Avatar mr={2} size="sm" bg="teal.500" /> {userData?.email}
							</MenuItem>
							<MenuDivider />
							<Link to="/app/settings/subscription/">
								<MenuItem fontSize="small">Subscription</MenuItem>
							</Link>
							<Link to="/app/settings/general/">
								<MenuItem fontSize="small">Settings</MenuItem>
							</Link>
							<MenuDivider />
							<MenuItem onClick={props.onLoginOut} fontSize="small">
								Log Out
							</MenuItem>
						</MenuList>
					</Menu>
				</Box>
			</Flex>
			<Flex flex={1} h="calc(100% - 100px)" w="100%">
				<HStack spacing="0" w="100%" justify="start">
					<Flex
						h="100%"
						w="260px"
						shadow="base"
						bg="white"
						flexShrink={0}
						p="10"
						direction="column"
						justifyContent="space-between"
						pt="10"
					>
						<List spacing={7}>
							<ListItem display="flex" alignItems="center" fontSize="sm">
								<NavLink activeClassName={styles.activeNav} to="/app/chat-bots">
									<Flex alignItems="center">
										<svg style={{marginRight: '10px'}} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM12 17V11M9 14H15" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>

										Projects
									</Flex>
								</NavLink>
							</ListItem>
						</List>
						{getUsageComponent()}
					</Flex>
					{userData ? (
						<Switch>
							<Route path="/app/chat-bots">
								<ChatbotList />
							</Route>
							<Route path="/app/chat-bots-demo">
								<DemoChatbots />
							</Route>
							<Route path="/app/settings">
								<Settings />
							</Route>
							<ChatbotList />
						</Switch>
					) : (
						<Flex className={styles.appLoading}>
							<Spinner mr={2} /> Loading App...
						</Flex>
					)}
				</HStack>
			</Flex>
		</VStack>
	);
};
