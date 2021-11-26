import JavaScriptBuild.{ciApiJavaScriptBundler, javaScriptBundler, javaScriptTestRunnerHook}
import uk.gov.hmrc.DefaultBuildSettings.integrationTestSettings
import scoverage.ScoverageKeys
import uk.gov.hmrc.DefaultBuildSettings._
import uk.gov.hmrc.sbtdistributables.SbtDistributablesPlugin.publishingSettings

val appName = "digital-engagement-platform-skin"

lazy val scoverageSettings = {
  Seq(
    ScoverageKeys.coverageExcludedPackages :="""uk\.gov\.hmrc\.BuildInfo;.*\.Routes;.*\.RoutesPrefix;.*\.ErrorTemplate;.*\.ErrorHandler;.*\.TestOnlyTemplate;.*\.TestOnlyView;.*\.Reverse[^.]*""",
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
    scalaVersion                     := "2.12.9",
    libraryDependencies              ++= AppDependencies.compile ++ AppDependencies.test,
    pipelineStages in Assets := Seq(gzip),
    PlayKeys.playDefaultPort := 9193,
    SilencerSettings(),
    libraryDependencies ++= AppDependencies.all,
    javaScriptBundler,
    ciApiJavaScriptBundler,
    javaScriptTestRunnerHook,
    defaultSettings(),
    Concat.groups := Seq(
      "javascripts/bundle.js" -> group(Seq("javascripts/bundle/gtm_dl.js")),
      "javascripts/ci_api.js" -> group(Seq("javascripts/ci_api_bundle/ci_api.js"))
    ),
    pipelineStages in Assets := Seq(concat),
  )
  .settings(publishingSettings: _*)
  .configs(IntegrationTest)
  .settings(integrationTestSettings(): _*)
  .settings(resolvers += Resolver.jcenterRepo)
  .settings(scoverageSettings)
