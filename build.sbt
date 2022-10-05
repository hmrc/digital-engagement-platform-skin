import JavaScriptBuild.{javaScriptBundler}
import uk.gov.hmrc.DefaultBuildSettings.integrationTestSettings
import scoverage.ScoverageKeys
import uk.gov.hmrc.DefaultBuildSettings._
import uk.gov.hmrc.sbtdistributables.SbtDistributablesPlugin.publishingSettings

val appName = "digital-engagement-platform-skin"

lazy val scoverageSettings = {
  Seq(
    //ScoverageKeys.coverageExcludedPackages :="""uk\.gov\.hmrc\.BuildInfo;.*\.Routes;.*\.RoutesPrefix;.*\.ErrorTemplate;.*\.ErrorHandler;.*\.TestOnlyTemplate;.*\.TestOnlyView;.*\.Reverse[^.]*""",
    ScoverageKeys.coverageExcludedPackages := "<empty>;Reverse.*;.*(config|views.*);.*(AuthService|BuildInfo|Routes).*",
    ScoverageKeys.coverageExcludedFiles := Seq(
      "" +
        "<empty>",
      "Reverse.*",
      ".*models.*",
      ".*repositories.*",
      ".*BuildInfo.*",
      ".*javascript.*",
      ".*Routes.*",
      ".*GuiceInjector",
      ".*DateTimeQueryStringBinder.*", // better covered via wiremock/E2E integration tests
      ".*Test.*"
    ).mkString(";"),
    ScoverageKeys.coverageMinimum := 88,
    ScoverageKeys.coverageFailOnMinimum := false,
    ScoverageKeys.coverageHighlighting := true
  )
}



lazy val microservice = Project(appName, file("."))
  .enablePlugins(play.sbt.PlayScala, SbtDistributablesPlugin, ScoverageSbtPlugin)
  .disablePlugins(JUnitXmlReportPlugin)
  .settings(
    majorVersion                     := 0,
    scalaVersion                     := "2.12.15",
    PlayKeys.playDefaultPort := 9193,
    SilencerSettings(),
    libraryDependencies ++= AppDependencies.all,
    javaScriptBundler,
    defaultSettings(),
    Concat.groups := Seq(
      "javascripts/hmrcChatSkinBundle.js" -> group(Seq("javascripts/bundle/hmrcChatSkin.js"))
    ),
    pipelineStages in Assets := Seq(concat)
  )
  .settings(publishingSettings: _*)
  .configs(IntegrationTest)
  .settings(integrationTestSettings(): _*)
  .settings(resolvers += Resolver.jcenterRepo)
  .settings(scoverageSettings)
