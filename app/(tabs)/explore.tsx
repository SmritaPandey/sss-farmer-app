import { Redirect } from 'expo-router';

// Explore page removed: redirect to Home
export default function ExploreRedirect() {
	return <Redirect href="/(tabs)" />;
}
